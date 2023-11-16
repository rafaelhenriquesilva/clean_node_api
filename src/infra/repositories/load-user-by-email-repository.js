class LoadUserByEmailRepository {
  constructor (userRepository) {
    this.userRepository = userRepository
  }

  async load (email) {
    return this.userRepository.findByEmail(email)
  }
}

module.exports = LoadUserByEmailRepository
