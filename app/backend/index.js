import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import routes from './routes/index.js'
import eventRoutes from './routes/eventRoutes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

if(process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
  })

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)) 
}

app.use('/', routes)
app.use('/events', eventRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected')
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    
    const shutdown = () => {
      console.log('Shutting down server...')
      server.close(() => {
        console.log('Server closed')
        mongoose.connection.close(false).then(() => {
          console.log('MongoDB connection closed')
          process.exit(0)
        })
      })
    }

    process.on('SIGTERM', shutdown) // for local development (ctrl + c)
    process.on('SIGINT', shutdown) // for production (docker stop or aws stop)
  })
  .catch(err => {
    console.error('MongoDB error:', err)
    process.exit(1)
  })