module.exports = class MissingParamError extends Error {
  constructor (className) {
    super(`Missing injectable: ${className}`)
    this.name = 'MissingInjectableError'
  }
}
