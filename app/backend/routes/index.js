import express from 'express'
import testRoutes from './test.js'
import authRoutes from './auth.js'
import getEventsRoutes from './getEvents.js'

const router = express.Router()

// router.use('/', testRoutes)
router.use('/', testRoutes)
router.use('/api/auth', authRoutes)
router.use('/api/getEvents', getEventsRoutes)
export default router