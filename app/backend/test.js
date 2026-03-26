import express from 'express'
import authRoutes from './routes/auth.js'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Mongoose connection succeeded"))
.catch(err => console.error("Mongoose connection failed", err));


const app = express();
app.use(cors());

app.use(express.json());

//Handle malformed inputs for debugging
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON received:', err.body); // Logs the actual malformed string
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next();
});

app.use('/', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(8000, () => {
  console.log(`Example app listening on port ${8000}`)
})