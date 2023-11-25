// database.js
const mongoose = require('mongoose')

class Database {
  url = ''
  options = {}
  async connect (dbName) {
    this.url = 'mongodb://root:example@localhost:27017/?authMechanism=DEFAULT'
    this.options = {
      user: 'root',
      pass: 'example',
      dbName
    }

    return new Promise((resolve, reject) => {
      mongoose.connect(this.url, this.options)

      this.db = mongoose.connection

      this.db.on('error', (error) => reject(error))
      this.db.once('open', () => {
        resolve(this.db)
      })
    })
  }

  async disconnect () {
    await this.db.close()
    this.db = null
  }
}

module.exports = Database
