import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'

// Import routes
import authRoutes from './routes/auth.routes.js'
import jobRoutes from './routes/job.routes.js'
import candidateRoutes from './routes/candidate.routes.js'
import publicRoutes from './routes/public.routes.js'
import publicScreeningRoutes from './routes/publicScreening.routes.js'

dotenv.config()
connectDB()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Create uploads directory if it doesn't exist
import fs from 'fs'
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads')
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/candidates', candidateRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/public', publicScreeningRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI ATS API is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    message: err.message || 'Something went wrong' 
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
