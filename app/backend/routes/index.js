import express from 'express'
import testRoutes from './test.js'
import authRoutes from './auth.js'
import eventRoutes from './eventRoutes.js'
import organizationRoutes from './organizationRoutes.js'

const router = express.Router()

// router.use('/', testRoutes)
router.use('/', testRoutes)
router.use('/api/auth', authRoutes)
router.use('/events', eventRoutes)
router.use('/organizations', organizationRoutes)

export default router