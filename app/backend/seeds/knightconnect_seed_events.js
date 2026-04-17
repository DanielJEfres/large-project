import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { readFileSync } from 'fs'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import Organization from '../models/Organization.js'
import Event from '../models/Event.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env') })

const KC_IMAGE_BASE = 'https://se-images.campuslabs.com/clink/images/'

// S3Client constructed after dotenv so env vars are available
let s3
function getS3() {
  if (!s3) s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })
  return s3
}

async function fetchAndUploadFlyer(imagePath) {
  if (!imagePath) return null
  const ext = imagePath.split('.').pop().toLowerCase()
  if (ext === 'pdf') return null
  try {
    const res = await fetch(`${KC_IMAGE_BASE}${imagePath}`, { redirect: 'follow' })
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const key = `flyers/${Date.now()}-${imagePath}`
    await new Upload({
      client: getS3(),
      params: { Bucket: process.env.AWS_BUCKET_NAME, Key: key, Body: buffer, ContentType: contentType },
    }).done()
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
  } catch (err) {
    console.error(`    [IMG ERR] ${imagePath}: ${err.message}`)
    return null
  }
}

const SYSTEM_USER_ID = new mongoose.Types.ObjectId('000000000000000000000001')

function stripHtml(html) {
  if (!html) return null
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || null
}

function deriveStatus(startsOn, endsOn) {
  const now = new Date()
  const start = new Date(startsOn)
  const end = endsOn ? new Date(endsOn) : null
  if (end && now > end) return 'completed'
  if (now >= start) return 'ongoing'
  return 'upcoming'
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const raw = readFileSync(
    resolve(__dirname, 'knightconnect_cache/knightconnect_events.json'),
    'utf-8'
  )
  const { value: events } = JSON.parse(raw)
  console.log(`Loaded ${events.length} events from JSON`)

  // Build a name → _id map from orgs already in the database
  const orgNameToId = {}
  const allOrgs = await Organization.find({}, { name: 1 }).lean()
  for (const org of allOrgs) {
    orgNameToId[org.name.trim().toLowerCase()] = org._id
  }
  console.log(`Loaded ${allOrgs.length} organizations for lookup`)

  await Event.deleteMany({ createdBy: SYSTEM_USER_ID })
  console.log('Cleared existing KnightConnect events')

  const docs = []
  const unmatched = []

  for (const e of events) {
    if (e.status !== 'Approved' || e.visibility !== 'Public') continue

    const orgName = e.organizationName?.trim() ?? ''
    const organizationId = orgNameToId[orgName.toLowerCase()] ?? null

    if (!organizationId) unmatched.push(orgName)

    const flyer = await fetchAndUploadFlyer(e.imagePath)
    console.log(`  [${flyer ? 'OK' : 'NO IMG'}] ${e.name}`)

    docs.push({
      title: e.name.trim(),
      description: stripHtml(e.description),
      location: e.location?.trim() || null,
      startDate: new Date(e.startsOn),
      endDate: e.endsOn ? new Date(e.endsOn) : null,
      organizationId,
      createdBy: SYSTEM_USER_ID,
      tags: [],
      attendees: [],
      isRSO: !!e.organizationId,
      flyer,
      status: deriveStatus(e.startsOn, e.endsOn),
      isPublic: true,
      rsvpEnabled: e.rsvpTotal != null,
    })
  }

  if (unmatched.length) {
    console.warn(`No org match for ${unmatched.length} event(s):`)
    unmatched.forEach(n => console.warn('  -', n || '(empty)'))
  }

  await Event.insertMany(docs, { ordered: false })
  console.log(`Seeded ${docs.length} events (${docs.filter(d => d.organizationId).length} linked to orgs)`)

  await mongoose.disconnect()
  console.log('Done')
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
