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
      for (const field in updatedFields) {
        if (Object.prototype.hasOwnProperty.call(updatedFields, field)) {
          if (user[0][field] !== undefined) {
            user[0][field] = updatedFields[field]
          }
        }
      }

      await user[0].save()
    }
  }

  verifyInjectable () {
    if (!this.UserModel) throw new MissingInjectableError('UserModel')
  }
}

module.exports = UserRepository
