import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import routes from './routes/index.js'
import cookieParser from 'cookie-parser'

const app = express()

// Without config (origin), cookies will NOT be sent.
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      process.env.API_URL,
      'http://localhost:5173',
      'http://localhost:3000',
    ],
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

//Handle malformed inputs for debugging
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON received:', err.body); // Logs the actual malformed string
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next();
});

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
  })
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

app.use('/', routes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default app
