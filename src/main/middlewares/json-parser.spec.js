const request = require('supertest')
const app = require('../config/app')
describe('JSON PARSER MID', () => {
  test('Should parse body as JSON', async () => {
    app.post('/test_json_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_json_parser')
      .send({
        name: 'Rafael'
      })
      .expect({ name: 'Rafael' })
  }, 15000)
})