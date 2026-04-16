import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'

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
  .catch((err) => {
    console.error('MongoDB error:', err)
    process.exit(1)
  })
