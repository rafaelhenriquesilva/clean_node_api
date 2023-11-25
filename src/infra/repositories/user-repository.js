const { MissingInjectableError } = require('../../utils/errors')

class UserRepository {
  constructor (UserModel) {
    this.UserModel = UserModel
  }

  async findByEmail (email) {
    this.verifyInjectable()
    return this.UserModel.find({ email })
  }

  async insertUser (email) {
    this.verifyInjectable()
    await this.UserModel.create({
      email
    })
  }

  async deleteAllUsers () {
    this.verifyInjectable()
    return this.UserModel.deleteMany({})
  }

  async updateUserByEmail (email, updatedFields) {
    this.verifyInjectable()
    const user = await this.findByEmail(email)

    if (user) {
      if (updatedFields.name) user[0].name = updatedFields.name
      if (updatedFields.name) user[0].email = updatedFields.email
      if (updatedFields.token) user[0].token = updatedFields.token
      await user[0].save()
    }
  }

  verifyInjectable () {
    if (!this.UserModel) throw new MissingInjectableError('UserModel')
  }
}

module.exports = UserRepository
