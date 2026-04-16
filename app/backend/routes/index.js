import express from 'express'
import testRoutes from './test.js'
import authRoutes from './auth.js'
import verifyEmailRoutes from './email-verification.js'
import passwordResetRoutes from './password-reset.js'
import eventRoutes from './eventRoutes.js'
import organizationRoutes from './organizationRoutes.js'
import getEventsRoutes from './getEvents.js'
import userRoutes from './userRoutes.js'
import tagRoutes from './interest-tags.js'

const router = express.Router()

//Authentication
router.use('/', testRoutes)
router.use('/api/auth', authRoutes)
router.use('/api/users', userRoutes)
router.use('/api/email-verification', verifyEmailRoutes)
router.use('/api/password-reset', passwordResetRoutes)
router.use('/api/events', eventRoutes)
router.use('/api/organizations', organizationRoutes)
router.use('/api/getEvents', getEventsRoutes)
router.use('/api/tags', tagRoutes)

export default router