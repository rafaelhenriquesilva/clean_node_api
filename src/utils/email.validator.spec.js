const EmailValidator = require('../utils/email-validator')
const validator = require('validator')
const { MissingParamError } = require('./errors')
const makeSut = () => {
  return new EmailValidator()
}
describe('', () => {
  test('Should return true if validators true', async () => {
    const sut = makeSut()
    const isEmailValid = await sut.isValid('valid_email@gmail.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should return false if validators false', async () => {
    const sut = makeSut()
    validator.isEmailValid = false
    const isEmailValid = await sut.isValid('invalid_email@gmail.com')
    expect(isEmailValid).toBe(false)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const anyEmail = 'any_email@gmail.com'
    sut.isValid(anyEmail)
    expect(validator.email).toBe(anyEmail)
  })

  test('Should throw if no email are provided', async () => {
    const sut = makeSut()
    expect(sut.isValid).rejects.toThrow(new MissingParamError('email'))
  })
})
