import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env') })

import Tag from '../models/Tag.js'

const TAGS = [
  'Technology',
  'Computer Science',
  'Engineering',
  'Mathematics',
  'Physics',
  'Biology',
  'Chemistry',
  'Environmental Science',
  'Medicine & Health',
  'Psychology',
  'Business',
  'Finance & Investing',
  'Entrepreneurship',
  'Law & Politics',
  'History',
  'Philosophy',
  'Literature',
  'Languages',
  'Education',
  'Art & Design',
  'Music',
  'Film & Media',
  'Photography',
  'Architecture',
  'Sports',
  'Fitness & Wellness',
  'Outdoor & Adventure',
  'Gaming',
  'Community Service',
  'Networking & Professional Development',
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  await Tag.deleteMany({})
  console.log('Cleared existing tags')

  await Tag.insertMany(TAGS.map(name => ({ name })))
  console.log(`Seeded ${TAGS.length} tags`)

  await mongoose.disconnect()
  console.log('Done')
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
