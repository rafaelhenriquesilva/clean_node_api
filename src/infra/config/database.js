// database.js
const mongoose = require('mongoose')

class Database {
  async connect (dbName) {
    const url = 'mongodb://root:example@localhost:27017/?authMechanism=DEFAULT'
    const options = {
      user: 'root',
      pass: 'example',
      dbName
    }

    mongoose.connect(url, options)

    this.db = mongoose.connection

    this.db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'))
    this.db.once('open', () => {
      console.log('Conexão bem-sucedida com o MongoDB!')
    })

    return this.db
  }

  async disconnect () {
    this.db.close()
  }
}

module.exports = Database
