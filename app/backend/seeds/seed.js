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
import RSVP from '../models/RSVP.js'

// ── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  // Clear existing data
  // starts all deletions at the same time because they dont depend on each other
  await Promise.all([
    Tag.deleteMany({}),
    User.deleteMany({}),
    Organization.deleteMany({}),
    Event.deleteMany({}),
    RSVP.deleteMany({}),
  ])
  console.log('Cleared existing data')

  // Tags
  // insertMany inserts an array of objects into the collection in one database call
  const tags = await Tag.insertMany([
    { name: 'Sports',           isCustom: false, isApproved: true, createdBy: null },
    { name: 'Computer Science', isCustom: false, isApproved: true, createdBy: null },
    { name: 'Music',            isCustom: false, isApproved: true, createdBy: null },
    { name: 'Art',              isCustom: false, isApproved: true, createdBy: null },
    { name: 'Business',        isCustom: false, isApproved: true, createdBy: null },
    { name: 'Volunteering',    isCustom: false, isApproved: true, createdBy: null },
    { name: 'Marine Biology',        isCustom: false, isApproved: true, createdBy: null },
    { name: 'Engineering',              isCustom: false, isApproved: true, createdBy: null },
    { name: 'Professional Development', isCustom: false, isApproved: true, createdBy: null },
    { name: 'Fashion',                  isCustom: false, isApproved: true, createdBy: null },
  ])
  console.log('Tags seeded')

  // Users
  const users = await User.insertMany([
    {
      firstName: 'Sofia',
      lastName: 'Flores',
      ucfEmail: 'sofiaisabel.floresnavarro@ucf.edu',
      passwordHash: '$2b$10$rp1NeX4oHEjDxjAAAR4.We4lID6uQLlYNSSg/QsPhXYiqGiLkQMNC',
      role: 'admin',
      interests: ['Computer Science', 'Music'],
      bio: 'Aspiring ML engineer and AI@UCF Vice-President',
      isVerified: true,
      isActive: true,
    },
    {
      firstName: 'Lucia',
      lastName: 'Diaz',
      ucfEmail: 'lucia.diaz@ucf.edu',
      passwordHash: '$2b$10$rp1NeX4oHEjDxjAAAR4.We4lID6uQLlYNSSg/QsPhXYiqGiLkQMNC',
      role: 'student',
      interests: ['Computer Science', 'Music'],
      bio: 'Data Science Student and AI@UCF President',
      isVerified: true,
      isActive: true,
    },
    {
      firstName: 'Marcus',
      lastName: 'Chen',
      ucfEmail: 'marcus.chen@ucf.edu',
      passwordHash: '$2b$10$rp1NeX4oHEjDxjAAAR4.We4lID6uQLlYNSSg/QsPhXYiqGiLkQMNC',
      role: 'student',
      interests: ['Computer Science', 'Business'],
      bio: 'CS student passionate about machine learning and AI applications.',
      isVerified: true,
      isActive: true,
    },
    {
      firstName: 'Cory',
      lastName: 'McWilliams',
      ucfEmail: 'cory.mcwilliams@ucf.edu',
      passwordHash: '$2b$10$rp1NeX4oHEjDxjAAAR4.We4lID6uQLlYNSSg/QsPhXYiqGiLkQMNC',
      role: 'student',
      interests: ['Marine Biology', 'Volunteering'],
      bio: 'Marine biology student and president of MBEAC. Passionate about ocean conservation and environmental education.',
      isVerified: true,
      isActive: true,
    },
    {
      firstName: 'Katherine',
      lastName: 'Mnzelli',
      ucfEmail: 'katherine.mnzelli@ucf.edu',
      passwordHash: '$2b$10$rp1NeX4oHEjDxjAAAR4.We4lID6uQLlYNSSg/QsPhXYiqGiLkQMNC',
      role: 'student',
      interests: ['Marine Biology'],
      bio: 'Secretary of MBEAC.',
      isVerified: true,
      isActive: true,
    },
    {
      firstName: 'Renzo',
      lastName: 'Torrico',
      ucfEmail: 'renzo.torrico@ucf.edu',
      passwordHash: '$2b$10$rp1NeX4oHEjDxjAAAR4.We4lID6uQLlYNSSg/QsPhXYiqGiLkQMNC',
      role: 'student',
      interests: ['Marine Biology', 'Volunteering'],
      bio: 'Marine biology student passionate about marine conservation.',
      isVerified: true,
      isActive: true,
    },
    {
      firstName: 'Nicholas',
      lastName: 'Caballero',
      ucfEmail: 'nicholas.caballero@ucf.edu',
      passwordHash: '$2b$10$rp1NeX4oHEjDxjAAAR4.We4lID6uQLlYNSSg/QsPhXYiqGiLkQMNC',
      role: 'student',
      interests: ['Sports', 'Engineering', 'Professional Development'],
      bio: 'Mechanical engineering student and president of SHPE UCF.',
      isVerified: true,
      isActive: true,
    },
    {
      firstName: 'Alessandra',
      lastName: 'Renelli',
      ucfEmail: 'alessandra.renelli@ucf.edu',
      passwordHash: '$2b$10$rp1NeX4oHEjDxjAAAR4.We4lID6uQLlYNSSg/QsPhXYiqGiLkQMNC',
      role: 'student',
      interests: ['Computer Science', 'Professional Development'],
      bio: 'CS student and SHPEtinas director at SHPE UCF.',
      isVerified: true,
      isActive: true,
    },
    {
      firstName: '0',
      lastName: 'Orjuela',
      ucfEmail: 'david.orjuela@ucf.edu',
      passwordHash: '$2b$10$examplehashedpassword9',
      role: 'student',
      interests: ['Computer Science', 'Engineering', 'Professional Development'],
      bio: 'CS student and member of both AI@UCF and SHPE UCF.',
      isVerified: true,
      isActive: true,
    },
    {
      firstName: 'Shauny',
      lastName: 'Nguyen',
      ucfEmail: 'shauny.nguyen@ucf.edu',
      passwordHash: '$2b$10$rp1NeX4oHEjDxjAAAR4.We4lID6uQLlYNSSg/QsPhXYiqGiLkQMNC0',
      role: 'student',
      interests: ['Fashion', 'Business'],
      bio: 'Marketing student and president of UCF Fashion Society.',
      isVerified: true,
      isActive: true,
    },
    {
      firstName: 'Victoria',
      lastName: 'Sonza',
      ucfEmail: 'victoria.sonza@ucf.edu',
      passwordHash: '$2b$10$rp1NeX4oHEjDxjAAAR4.We4lID6uQLlYNSSg/QsPhXYiqGiLkQMNC1',
      role: 'student',
      interests: ['Fashion', 'Business'],
      bio: 'Integrated business student and secretary of UCF Fashion Society.',
      isVerified: true,
      isActive: true,
    },
    {
      firstName: 'Samantha',
      lastName: 'Amaro',
      ucfEmail: 'samantha.amaro@ucf.edu',
      passwordHash: '$2b$10$rp1NeX4oHEjDxjAAAR4.We4lID6uQLlYNSSg/QsPhXYiqGiLkQMNC2',
      role: 'student',
      interests: ['Computer Science', 'Art', 'Fashion'],
      bio: 'Student passionate about technology and art, member of AI@UCF and UCF Fashion Society.',
      isVerified: true,
      isActive: true,
    },
    {
      firstName: 'Adam',
      lastName: 'Mouedden',
      ucfEmail: 'adam.mouedden@ucf.edu',
      passwordHash: '$2b$10$rp1NeX4oHEjDxjAAAR4.We4lID6uQLlYNSSg/QsPhXYiqGiLkQMNC5',
      role: 'student',
      interests: ['Computer Science', 'Professional Development'],
      bio: 'Highly motivated aspiring ML engineer.',
      isVerified: true,
      isActive: true,
    },
    {
      firstName: 'Adrian',
      lastName: 'Osorio',
      ucfEmail: 'adrian.osorio@ucf.edu',
      passwordHash: '$2b$10$rp1NeX4oHEjDxjAAAR4.We4lID6uQLlYNSSg/QsPhXYiqGiLkQMNC3',
      role: 'student',
      interests: ['Computer Science', 'Professional Development'],
      bio: 'CS student and president of KnightHacks. Loves hackathons and building things.',
      isVerified: true,
      isActive: true,
    },
    {
      firstName: 'Daniel',
      lastName: 'Efres',
      ucfEmail: 'daniel.efres@ucf.edu',
      passwordHash: '$2b$10$rp1NeX4oHEjDxjAAAR4.We4lID6uQLlYNSSg/QsPhXYiqGiLkQMNC4',
      role: 'student',
      interests: ['Computer Science', 'Professional Development'],
      bio: 'CS student passionate about web development and Project Director at KnightHacks.',
      isVerified: true,
      isActive: true,
    },
  ])
  console.log('Users seeded')

  // Organizations
  const orgs = await Organization.insertMany([
    {
      name: 'AI @UCF Club',
      description: 'A club for CS students interested in ML and AI.',
      category: 'Academic',
      verificationStatus: 'approved',
      knightConnectUrl: 'https://knightconnect.campuslabs.com/engage/organization/ucfai',
      contactEmail: 'aiucf@ucf.edu',
      socialLinks: {
        instagram: 'https://www.instagram.com/_ucfai/',
      },
      createdBy: users[1]._id,
      president: users[1]._id,
      members: [
        { userId: users[1]._id,  orgRole: 'officer' },
        { userId: users[0]._id,  orgRole: 'officer' },
        { userId: users[2]._id,  orgRole: 'member' },
        { userId: users[8]._id,  orgRole: 'member' },
        { userId: users[12]._id, orgRole: 'member' },
      ],
      isActive: true,
    },
    {
      name: 'Marine Biology Education and Awareness Club',
      description: 'Promoting marine biology education and ocean conservation awareness at UCF.',
      category: 'Science',
      verificationStatus: 'approved',
      knightConnectUrl: 'https://knightconnect.campuslabs.com/engage/organization/mbeac',
      contactEmail: 'mbeacucf@gmail.com',
      socialLinks: {
        instagram: 'https://www.instagram.com/marinebioucf',
        discord: 'https://discord.gg/tagkq74aC5',
      },
      createdBy: users[3]._id,
      president: users[3]._id,
      members: [
        { userId: users[3]._id, orgRole: 'officer' },
        { userId: users[4]._id, orgRole: 'officer' },
        { userId: users[5]._id, orgRole: 'member' },
      ],
      isActive: true,
    },
    {
      name: 'Society of Hispanic Professional Engineers UCF',
      description: 'Empowering Hispanic and Latino engineering and STEM students at UCF to reach their fullest potential.',
      category: 'Professional',
      verificationStatus: 'approved',
      knightConnectUrl: 'https://knightconnect.campuslabs.com/engage/organization/shpeucf',
      contactEmail: 'shpeucf@ucf.edu',
      socialLinks: {
        instagram: 'https://www.instagram.com/shpeucf/',
        discord: 'https://discord.com/invite/K5fXQJbR',
        website: 'https://www.shpeucf.com/',
      },
      createdBy: users[6]._id,
      president: users[6]._id,
      members: [
        { userId: users[6]._id, orgRole: 'officer' },
        { userId: users[7]._id, orgRole: 'director' },
        { userId: users[8]._id, orgRole: 'member' },
      ],
      isActive: true,
    },
    {
      name: 'UCF Fashion Society',
      description: 'An all-inclusive club creating safe spaces for all students interested in the fashion industry.',
      category: 'Arts',
      verificationStatus: 'approved',
      knightConnectUrl: null,
      contactEmail: 'fashionsocietyucf@gmail.com',
      socialLinks: {
        instagram: 'https://www.instagram.com/fashionsocietyucf/',
        website: 'https://ucffashionsociety.com/',
      },
      createdBy: users[9]._id,
      president: users[9]._id,
      members: [
        { userId: users[9]._id,  orgRole: 'officer' },
        { userId: users[10]._id, orgRole: 'officer' },
        { userId: users[11]._id, orgRole: 'member' },
      ],
      isActive: true,
    },
    {
      name: 'KnightHacks',
      description: 'UCF\'s hackathon and SWE RSO. We host professional development workshops, hackathons, sponsor events, and more to help students grow as engineers and professionals.',
      category: 'Technology',
      verificationStatus: 'approved',
      knightConnectUrl: 'https://knightconnect.campuslabs.com/engage/organization/knighthacks',
      contactEmail: 'president@knighthacks.org',
      socialLinks: {
        website: 'https://blade.knighthacks.org',
      },
      createdBy: users[13]._id,
      president: users[13]._id,
      members: [
        { userId: users[13]._id, orgRole: 'officer' },
        { userId: users[14]._id, orgRole: 'director' },
        { userId: users[0]._id,  orgRole: 'member' },
        { userId: users[8]._id,  orgRole: 'member' },
        { userId: users[11]._id, orgRole: 'member' },
        { userId: users[7]._id,  orgRole: 'member' },
      ],
      isActive: true,
    },
  ])
  console.log('Organizations seeded')

  // Custom tags
  const customTag = await Tag.create({
    name: 'Artificial Intelligence',
    isCustom: true,
    isApproved: true,
    createdBy: orgs[0]._id,
  })

  const marineTag = await Tag.create({
    name: 'Ocean Conservation',
    isCustom: true,
    isApproved: true,
    createdBy: orgs[1]._id,
  })

  // Events
  const now = new Date()
  const events = await Event.insertMany([
    {
      title: 'Intro to Machine Learning Workshop',
      description: 'A hands-on workshop covering the fundamentals of ML — from linear regression to neural networks. Open to all UCF students.',
      location: 'Engineering Building 2, Room 203',
      startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),  // 1 week from now
      endDate:   new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      organizationId: orgs[0]._id,
      createdBy: users[0]._id,
      tags: [tags[1]._id, customTag._id],
      isRSO: true,
      status: 'upcoming',
      isPublic: true,
      rsvpEnabled: true,
    },
    {
      title: 'Marine Life of Florida: Awareness Night',
      description: 'An educational night exploring Florida\'s marine ecosystems, local conservation efforts, and how UCF students can get involved.',
      location: 'Biological Sciences Building, Room 101',
      startDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),  // 5 days from now
      endDate:   new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      organizationId: orgs[1]._id,
      createdBy: users[3]._id,
      tags: [tags[6]._id, marineTag._id],
      isRSO: true,
      status: 'upcoming',
      isPublic: true,
      rsvpEnabled: true,
    },
    {
      title: 'SHPEtinas Pilates',
      description: 'A fun and relaxing pilates session hosted by SHPEtinas. Come unwind, move your body, and connect with fellow SHPE members!',
      location: 'UCF Recreation and Wellness Center',
      startDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),  // 6 days from now
      endDate:   new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
      organizationId: orgs[2]._id,
      createdBy: users[7]._id,
      tags: [tags[0]._id],
      isRSO: true,
      status: 'upcoming',
      isPublic: true,
      rsvpEnabled: true,
    },
    {
      title: 'Spring Runway Show: Timebomb — "The Moment Before"',
      description: 'UCF Fashion Society\'s Spring Runway Show. A bold and immersive showcase exploring the tension of the moment before everything changes.',
      location: 'Florida Mall',
      startDate: new Date('2026-04-19T15:00:00'),
      endDate:   new Date('2026-04-19T17:00:00'),
      organizationId: orgs[3]._id,
      createdBy: users[9]._id,
      tags: [tags[9]._id, tags[3]._id],
      isRSO: true,
      status: 'upcoming',
      isPublic: true,
      rsvpEnabled: true,
    },
    {
      title: 'Project Launch Checkpoint #1',
      description: 'KnightHacks project teams present their first checkpoint — showcasing initial progress, goals, and technical direction.',
      location: 'L3Harris Corporation Engineering Center, Room 101',
      startDate: new Date('2026-03-10T17:30:00'),
      endDate:   new Date('2026-03-10T19:30:00'),
      organizationId: orgs[4]._id,
      createdBy: users[14]._id,
      tags: [tags[1]._id, tags[8]._id],
      isRSO: true,
      status: 'completed',
      isPublic: true,
      rsvpEnabled: true,
    },
  ])
  console.log('Events seeded')

  // RSVPs
  await RSVP.insertMany([
    { userId: users[2]._id,  eventId: events[0]._id, status: 'going', attended: false },
    { userId: users[1]._id,  eventId: events[0]._id, status: 'going', attended: false },
    { userId: users[8]._id,  eventId: events[0]._id, status: 'going', attended: false },
    { userId: users[12]._id, eventId: events[0]._id, status: 'going', attended: false },
    { userId: users[11]._id, eventId: events[3]._id, status: 'going', attended: false },
    { userId: users[9]._id,  eventId: events[3]._id, status: 'going', attended: false },
    { userId: users[5]._id,  eventId: events[1]._id, status: 'going', attended: false },
    { userId: users[11]._id, eventId: events[4]._id, status: 'going', attended: true },
    { userId: users[7]._id,  eventId: events[4]._id, status: 'going', attended: true },
    { userId: users[12]._id, eventId: events[4]._id, status: 'going', attended: true },
    { userId: users[8]._id,  eventId: events[4]._id, status: 'going', attended: true },
  ])
  console.log('RSVPs seeded')

  console.log('Seed complete!')
  await mongoose.disconnect()
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
