const jwt = require('jsonwebtoken')
class TokenGenerator {
  async generate (id) {
    return jwt.sign(id, 'secret')
  }
}
const makeSut = () => {
  const tokenGenerator = new TokenGenerator()
  return tokenGenerator
}
describe('Token Generator', () => {
  test('Should return null if jwt returns null', async () => {
    const sut = makeSut()
    jwt.token = null
    const token = await sut.generate('any_id')
    sut.token = null

    expect(token).toBeNull()
  })
  test('Should return token if jwt returns token', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })
})
