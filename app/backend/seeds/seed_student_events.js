import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { readFileSync } from 'fs'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import Event from '../models/Event.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env') })

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

async function uploadToS3(filename) {
  const buffer = readFileSync(resolve(__dirname, 'knightconnect_cache', filename))
  const key = `flyers/${Date.now()}-${filename}`
  await new Upload({
    client: getS3(),
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
    },
  }).done()
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}

const STUDENT_EVENTS = [
  {
    title: 'Study Group: Calc 2 Final Prep',
    description: 'Open study session for anyone struggling with Calc 2. Bring your notes, practice exams, and questions. All levels welcome — we work through problems together.',
    location: 'John C. Hitt Library, Study Room 214',
    startDate: new Date('2026-04-22T18:00:00'),
    endDate:   new Date('2026-04-22T21:00:00'),
    image: 'student_event_1.jpg',
  },
  {
    title: 'UCF Pickup Soccer — Weekly Kickaround',
    description: 'Casual pickup soccer every Saturday morning. No experience needed, just show up and play. We split into teams on the spot.',
    location: 'Memory Mall',
    startDate: new Date('2026-04-26T09:00:00'),
    endDate:   new Date('2026-04-26T11:00:00'),
    image: 'student_event_2.jpg',
  },
  {
    title: 'Board Game Night',
    description: 'Bring your favorite board game or just show up. We have Catan, Codenames, Ticket to Ride, and more. Great way to unwind before finals.',
    location: 'Student Union, Room 218',
    startDate: new Date('2026-04-24T19:00:00'),
    endDate:   new Date('2026-04-24T22:00:00'),
    image: 'student_event_3.jpg',
  },
  {
    title: 'Photography Walk: UCF Campus at Golden Hour',
    description: 'Casual photography meetup around campus. Shoot with whatever you have — phone, DSLR, film. We share and critique each other\'s shots afterwards.',
    location: 'Reflecting Pond (meet here)',
    startDate: new Date('2026-04-25T18:30:00'),
    endDate:   new Date('2026-04-25T20:30:00'),
    image: 'student_event_4.jpg',
  },
  {
    title: 'Open Mic Night',
    description: 'Got a song, poem, stand-up bit, or just want to watch? Come out for a chill open mic. Sign up at the door or just enjoy the show.',
    location: 'The Venue at UCF',
    startDate: new Date('2026-04-23T20:00:00'),
    endDate:   new Date('2026-04-23T23:00:00'),
    image: 'student_event_5.jpg',
  },
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  await Event.deleteMany({ isRSO: false, createdBy: SYSTEM_USER_ID })
  console.log('Cleared existing seeded student events')

  for (const e of STUDENT_EVENTS) {
    console.log(`  Uploading flyer for "${e.title}"...`)
    const flyer = await uploadToS3(e.image)

    await Event.create({
      title: e.title,
      description: e.description,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate,
      organizationId: null,
      createdBy: SYSTEM_USER_ID,
      tags: [],
      attendees: [],
      isRSO: false,
      flyer,
      status: 'upcoming',
      isPublic: true,
      rsvpEnabled: true,
    })
    console.log(`  [OK] "${e.title}"`)
  }

  console.log(`\nSeeded ${STUDENT_EVENTS.length} student events`)
  await mongoose.disconnect()
  console.log('Done')
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
