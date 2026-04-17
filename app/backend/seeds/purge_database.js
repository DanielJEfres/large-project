import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env') })

import Tag from '../models/Tag.js'
import User from '../models/User.js'
import Organization from '../models/Organization.js'
import Event from '../models/Event.js'

// ── Seed ─────────────────────────────────────────────────────────────────────

async function purge() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  // Clear existing data
  // starts all deletions at the same time because they dont depend on each other
  await Promise.all([
    Tag.deleteMany({}),
    User.deleteMany({}),
    Organization.deleteMany({}),
    Event.deleteMany({}),
  ])
  console.log('Cleared existing data')
}


purge().catch(err => {
  console.error(err)
  process.exit(1)
})