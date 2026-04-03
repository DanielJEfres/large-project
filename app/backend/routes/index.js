import express from 'express'
import testRoutes from './test.js'
import authRoutes from './auth.js'
import verifyEmail from './email-verification.js'
import passwordResetRoutes from './password-reset.js'
import eventRoutes from './eventRoutes.js'
import organizationRoutes from './organizationRoutes.js'
import getEventsRoutes from './getEvents.js'

const router = express.Router()

//Authentication
router.use('/', testRoutes)
router.use('/api/auth', authRoutes)
// middleware: router.use('/api/users', authenticateToken, userRoutes)
// authenticateToken as middleware protects entire route
router.use('/api/verifyEmail', verifyEmail)
router.use('/api/events', eventRoutes)
router.use('/api/organizations', organizationRoutes)

router.use('/api/getEvents', getEventsRoutes)

export default router