const EmailValidator = require('../utils/email-validator')
const validator = require('validator')
const makeSut = () => {
  return new EmailValidator()
}
describe('', () => {
  test('Should return true if validators true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@gmail.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should return true if validators false', () => {
    const sut = makeSut()
    validator.isEmailValid = false
    const isEmailValid = sut.isValid('invalid_email@gmail.com')
    expect(isEmailValid).toBe(false)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const anyEmail = 'any_email@gmail.com'
    sut.isValid(anyEmail)
    expect(validator.email).toBe(anyEmail)
  })
})
