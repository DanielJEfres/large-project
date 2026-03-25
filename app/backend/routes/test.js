import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
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