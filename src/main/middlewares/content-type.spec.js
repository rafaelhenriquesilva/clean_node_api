const request = require('supertest')
const app = require('../config/app')
describe('Content-type Middleware', () => {
  test('Should return json Content-type default', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })
    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })
})
