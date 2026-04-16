import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../app.js'
import RefreshTokens from '../models/RefreshTokens.js'
import User from '../models/User.js'

const accessSecret = process.env.ACCESS_TOKEN_SECRET!

describe('Auth API integration', () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    process.env.MONGODB_URI = mongoServer.getUri()
    await mongoose.connect(process.env.MONGODB_URI)
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
  })

  afterEach(async () => {
    await User.deleteMany({})
    await RefreshTokens.deleteMany({})
  })

  it('POST /api/auth/signup registers a user with isVerified false', async () => {
    const ucfEmail = `signup-${Date.now()}@ucf.edu`
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        ucfEmail,
        firstName: 'Auth',
        lastName: 'Test',
        password: 'Password123!',
      })
      .expect(201)

    expect(res.body.userId).toBeDefined()
    const user = await User.findOne({ ucfEmail })
    expect(user).not.toBeNull()
    expect(user!.isVerified).toBe(false)
  })

  it('POST /api/auth/login returns 403 when email is not verified', async () => {
    const ucfEmail = `unverified-${Date.now()}@ucf.edu`
    await request(app)
      .post('/api/auth/signup')
      .send({
        ucfEmail,
        firstName: 'Un',
        lastName: 'Verified',
        password: 'Password123!',
      })
      .expect(201)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ ucfEmail, password: 'Password123!' })
      .expect(403)

    expect(res.body.message).toBe('User requires Email Verification')
  })

  it('POST /api/auth/login returns 200 and a valid accessToken JWT when verified', async () => {
    const ucfEmail = `verified-${Date.now()}@ucf.edu`
    const signup = await request(app)
      .post('/api/auth/signup')
      .send({
        ucfEmail,
        firstName: 'Ver',
        lastName: 'Ified',
        password: 'Password123!',
      })
      .expect(201)

    const userId = signup.body.userId as string
    await User.findByIdAndUpdate(userId, { isVerified: true })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ ucfEmail, password: 'Password123!' })
      .expect(200)

    expect(typeof res.body.accessToken).toBe('string')
    expect(res.body.accessToken.length).toBeGreaterThan(0)

    const payload = jwt.verify(res.body.accessToken, accessSecret) as jwt.JwtPayload
    expect(payload.sub).toBe(userId)
    expect(payload.exp).toBeDefined()
  })
})
