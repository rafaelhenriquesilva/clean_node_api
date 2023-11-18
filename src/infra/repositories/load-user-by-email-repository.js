const { MissingParamError } = require('../../utils/errors')

class LoadUserByEmailRepository {
  constructor (userRepository) {
    this.userRepository = userRepository
  }

  async load (email) {
    if (!email) {
      throw new MissingParamError('email')
    }
    return this.userRepository.findByEmail(email)
  }
}

module.exports = LoadUserByEmailRepository
