import express from 'express'
import authenticateToken from '../middleware/authenticateToken.js'

const router = express.Router()

router.get('/', (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader.split(" ")[1]
  console.log(token)
  res.status(200).json({
    message: 'API is online',
    docs: '/api-docs',
    health: '/health'
  })
})

/**
 * @openapi
 * /test:
 *   get:
 *     summary: Test endpoint
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Server is working
 */
router.get('/test', authenticateToken, (req, res) => {
  console.log(req.user)
  res.status(200).json({ message: 'Swagger is working!' })
})

export default router