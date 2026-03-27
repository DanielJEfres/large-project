import express from 'express'
import testRoutes from './test.js'
import authRoutes from './auth.js'

const router = express.Router()
const app = express()

<<<<<<< HEAD
// router.use('/', testRoutes)
app.use('/', testRoutes)
app.use('/api/auth', router)
=======
router.use('/test', testRoutes)
router.use('/', authRoutes)
>>>>>>> f0799c986d00a21f740cbf523447daf53d0d47c4

export default router