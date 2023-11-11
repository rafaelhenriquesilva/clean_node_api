const validator = require('validator')
class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}
describe('', () => {
  test('Should return true if validators true', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('valid_email@gmail.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should return true if validators false', () => {
    const sut = new EmailValidator()
    validator.isEmailValid = false
    const isEmailValid = sut.isValid('invalid_email@gmail.com')
    expect(isEmailValid).toBe(false)
  })
})
