const { MissingParamError, MissingInjectableError } = require('../../utils/errors')

class UpdatedAccessTokenRepository {
  constructor (userRepository) {
    this.userRepository = userRepository
  }

  async updateByEmail (email, token) {
    this.verifyInjectable()
    if (!email) throw new MissingParamError('email')
    if (!token) throw new MissingParamError('token')

    await this.userRepository.updateUserByEmail(email, { token })
  }

  verifyInjectable () {
    if (!this.userRepository) throw new MissingInjectableError('UserRepository')
  }
}

module.exports = UpdatedAccessTokenRepository
