import express from 'express'
import testRoutes from './test.js'
import authRoutes from './auth.js'
import verifyEmail from './email-verification.js'

const router = express.Router()

// router.use('/', testRoutes)
router.use('/', testRoutes)
router.use('/api/auth', authRoutes)
router.use('/api/verifyEmail', verifyEmail)

export default router