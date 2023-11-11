const MissingParamError = require('./missing-param-error')
const InvalidParamError = require('./invalid-param-error')
const InternalServerError = require('./server-error')
const UnauthorizedError = require('./unauthorized-error')

module.exports = {
  MissingParamError,
  InvalidParamError,
  InternalServerError,
  UnauthorizedError
}
