import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { readFileSync } from 'fs'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import Organization from '../models/Organization.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env') })

const BASE_KC_URL = 'https://knightconnect.campuslabs.com/engage/organization/'
const KC_IMAGE_BASE = 'https://se-images.campuslabs.com/clink/images/'
const SYSTEM_USER_ID = new mongoose.Types.ObjectId('000000000000000000000001')

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

function stripHtml(html) {
  if (!html) return null
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || null
}

async function fetchAndUploadLogo(profilePicture) {
  if (!profilePicture) return null
  const ext = profilePicture.split('.').pop().toLowerCase()
  if (ext === 'pdf') return null
  try {
    const res = await fetch(`${KC_IMAGE_BASE}${profilePicture}`, { redirect: 'follow' })
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const key = `logos/${Date.now()}-${profilePicture}`
    await new Upload({
      client: getS3(),
      params: { Bucket: process.env.AWS_BUCKET_NAME, Key: key, Body: buffer, ContentType: contentType },
    }).done()
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
  } catch (err) {
    console.error(`    [IMG ERR] ${profilePicture}: ${err.message}`)
    return null
  }
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const raw = readFileSync(
    resolve(__dirname, 'knightconnect_cache/knightconnect_organizations.json'),
    'utf-8'
  )
  const { value: orgs } = JSON.parse(raw)
  console.log(`Loaded ${orgs.length} organizations from JSON`)

  await Organization.deleteMany({ knightConnectUrl: { $regex: BASE_KC_URL } })
  console.log('Cleared existing KnightConnect organizations')

  const eligible = orgs.filter(org => org.Status === 'Active' && org.Visibility === 'Public')
  console.log(`Processing ${eligible.length} organizations...`)

  const docs = []
  for (const org of eligible) {
    const logo = await fetchAndUploadLogo(org.ProfilePicture)
    console.log(`  [${logo ? 'OK' : 'NO IMG'}] ${org.Name.trim()}`)
    docs.push({
      name: org.Name.trim(),
      description: stripHtml(org.Description) || stripHtml(org.Summary),
      category: org.CategoryNames?.[0] ?? null,
      verificationStatus: 'approved',
      knightConnectUrl: org.WebsiteKey ? `${BASE_KC_URL}${org.WebsiteKey}` : null,
      contactEmail: null,
      logo,
      socialLinks: {},
      createdBy: SYSTEM_USER_ID,
      president: null,
      members: [],
      isActive: true,
    })
  }

  await Organization.insertMany(docs, { ordered: false })
  console.log(`\nSeeded ${docs.length} organizations (${docs.filter(d => d.logo).length} with logos)`)

  await mongoose.disconnect()
  console.log('Done')
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
