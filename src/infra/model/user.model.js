const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  token: {
    type: 'String',
    default: ''
  },
  id: Number
}, { collection: 'users' })

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel
