import express from 'express'
import authenticateToken from '../middleware/authenticateToken.js'

const router = express.Router()

router.get('/', authenticateToken, (req, res) => {
  console.log(req.user.sub)
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
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Swagger is working!' })
})

export default router