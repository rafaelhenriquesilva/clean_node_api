const router = require('express').Router()
module.exports = app => {
  app.use('/api', router)
  require('./routes/login-route')(router)
}
