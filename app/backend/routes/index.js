import express from 'express'
import testRoutes from './test.js'
import authRoutes from './auth.js'
import verifyEmail from './email-verification.js'
import eventRoutes from './eventRoutes.js'
import organizationRoutes from './organizationRoutes.js'
import getEventsRoutes from './getEvents.js'

const router = express.Router()

// router.use('/', testRoutes)
router.use('/', testRoutes)
router.use('/api/auth', authRoutes)
router.use('/api/verifyEmail', verifyEmail)
router.use('/api/events', eventRoutes)
router.use('/api/organizations', organizationRoutes)

router.use('/api/getEvents', getEventsRoutes)
export default router