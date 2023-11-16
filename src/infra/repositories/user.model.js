const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  token: String,
  id: Number
}, { collection: 'users' })

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel
