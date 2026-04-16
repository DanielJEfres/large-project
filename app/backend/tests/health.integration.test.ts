import request from 'supertest'
import app from '../app.js'

describe('App HTTP', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health').expect(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})
