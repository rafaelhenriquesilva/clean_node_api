const Database = require('../infra/config/database')
const database = new Database()
database.connect('local')
  .then(() => {
    const app = require('./config/app')
    app.listen(3000, () => console.info('Server running'))
  })
  .catch(console.error)
