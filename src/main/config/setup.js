const corsMid = require('../middlewares/cors')
const bodyParserMid = require('../middlewares/json-parser')
const contentTypeMid = require('../middlewares/content-type')
module.exports = (app) => {
  app.disable('x-powered-by')
  app.use(corsMid)
  bodyParserMid(app)
  app.use(contentTypeMid)
}
