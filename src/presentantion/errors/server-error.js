module.exports = class ServerError extends Error {
  constructor () {
    super('Internal server error')
    this.name = 'InternalServerError'
  }
}
