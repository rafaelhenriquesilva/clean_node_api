const { MissingParamError, MissingInjectableError } = require('../../utils/errors')

class LoadUserByEmailRepository {
  constructor (userRepository) {
    this.userRepository = userRepository
  }

  async load (email) {
    this.verifyInjectable()
    if (!email) {
      throw new MissingParamError('email')
    }
    return this.userRepository.findByEmail(email)
  }

  verifyInjectable () {
    if (!this.userRepository) throw new MissingInjectableError('UserRepository')
  }
}

module.exports = LoadUserByEmailRepository
