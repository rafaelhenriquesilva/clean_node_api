const corsMid = require('../middlewares/cors')
module.exports = (app) => {
  app.disable('x-powered-by')
  app.use(corsMid)
}
