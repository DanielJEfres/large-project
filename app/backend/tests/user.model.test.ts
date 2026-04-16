import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import User from '../models/User.js'

describe('User model', () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
  })

  afterEach(async () => {
    await User.deleteMany({})
  })

  it('defaults isVerified to false and verificationToken to null', async () => {
    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      ucfEmail: 'defaults@ucf.edu',
      passwordHash: 'plaintext-for-hook',
    })

    const fromDb = await User.findById(user._id).lean()
    expect(fromDb?.isVerified).toBe(false)
    expect(fromDb?.verificationToken).toBeNull()
  })

  it('hashes passwordHash on save and matchPassword validates', async () => {
    const plain = 'MySecretPassword123!'
    const user = await User.create({
      firstName: 'Jane',
      lastName: 'Doe',
      ucfEmail: 'hashcheck@ucf.edu',
      passwordHash: plain,
    })

    const reloaded = await User.findById(user._id)
    expect(reloaded).not.toBeNull()
    expect(reloaded!.passwordHash).not.toBe(plain)
    expect(reloaded!.passwordHash).toMatch(/^\$2[aby]\$\d{2}\$/)

    const withMatch = reloaded as typeof reloaded & {
      matchPassword: (enteredPassword: string) => Promise<boolean>
    }
    await expect(withMatch.matchPassword(plain)).resolves.toBe(true)
    await expect(withMatch.matchPassword('wrong-password')).resolves.toBe(false)
  })
})
