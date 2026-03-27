import express from 'express'
import testRoutes from './test.js'
import authRoutes from './auth.js'

const router = express.Router()

// router.use('/', testRoutes)
router.use('/', testRoutes)
router.use('/api/auth', authRoutes)

export default router