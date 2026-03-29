import express from 'express'
import testRoutes from './test.js'
import authRoutes from './auth.js'

const router = express.Router()

// router.use('/', testRoutes)
router.use('/', testRoutes)
router.use('/api/auth', authRoutes)
//router.use('/api/events',[!] MIDDLEWARE GOES HERE: authenticateToken, eventRoutes)
//and similarly: router.use('/api/users', authenticateToken, userRoutes)
// authenticateToken as middleware protects entire route


export default router