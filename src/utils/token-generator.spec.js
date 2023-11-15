const jwt = require('jsonwebtoken')
const { MissingParamError } = require('./errors')
const TokenGenerator = require('./token-generator')
const makeSut = () => {
  const tokenGenerator = new TokenGenerator('secret')
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

  test('Should call jwt with correct values', async () => {
    const sut = makeSut()
    await sut.generate('any_id')
    expect(jwt.id).toBe('any_id')
    expect(jwt.secret).toBe(sut.secret)
  })

  test('Should throw if no secrer are provided', async () => {
    const sut = new TokenGenerator()
    const promise = sut.generate('any_id')
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })

  test('Should throw if no id are provided', async () => {
    const sut = makeSut()
    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
