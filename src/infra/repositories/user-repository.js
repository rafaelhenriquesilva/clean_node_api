class UserRepository {
  constructor (UserModel) {
    this.UserModel = UserModel
  }

  async findByEmail (email) {
    return this.UserModel.find({ email })
  }

  async insertUser (email) {
    await this.UserModel.create({
      email
    })
  }

  async deleteAllUsers () {
    return this.UserModel.deleteMany({})
  }
}

module.exports = UserRepository
