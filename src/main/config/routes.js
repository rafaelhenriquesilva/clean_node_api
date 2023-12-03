const router = require('express').Router()
//Aprender pegar os caminhos com fast glob
const fb = require('fast-glob')
module.exports = app => {
  app.use('/api', router)
  require('./routes/login-route')(router)
}
