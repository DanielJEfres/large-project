import express from 'express'
import testRoutes from './test.js'
import authRoutes from './auth.js'

const router = express.Router()

router.use('/', testRoutes)
router.use('/', authRoutes)

export default router