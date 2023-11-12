const { MissingParamError } = require('../../utils/errors')
module.exports = class AuthUseCase {
  constructor (args = {}) {
    this.loadUserByEmailRepository = args.loadUserByEmailRepository
    this.encrypter = args.encrypter
    this.tokenGenerator = args.tokenGenerator
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    const user = await this.loadUserByEmailRepository.load(email)
    const isValid = user && await this.encrypter.compare(password, user.password)
    if (user && isValid) {
      const token = await this.tokenGenerator.generate(user.id)
      return token
    }

    return null
  }
}
