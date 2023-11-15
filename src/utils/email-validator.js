const validator = require('validator')
const { MissingParamError } = require('./errors')
class EmailValidator {
  async isValid (email) {
    if (!email) throw new MissingParamError('email')
    return validator.isEmail(email)
  }
}

module.exports = EmailValidator
