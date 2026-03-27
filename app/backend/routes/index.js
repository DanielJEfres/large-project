import express from 'express'
import testRoutes from './test.js'

const router = express.Router()
const app = express()

// router.use('/', testRoutes)
app.use('/', testRoutes)
app.use('/api/auth', router)

export default router