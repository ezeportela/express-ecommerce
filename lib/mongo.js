const { MongoClient } = require('mongodb')
const { config } = require('../config')

const { dbUser, dbPassword, dbHost, dbPort, dbName } = config

const user = encodeURIComponent(dbUser)
const password = encodeURIComponent(dbPassword)

const MONGO_URI = `mongodb://${user}:${password}@${dbHost}:${dbPort}/?authSource=${dbName}`

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true })
    this.dbName = dbName
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client.connect(error => {
        if (error) {
          reject(error)
        }

        resolve(this.client.db(this.dbName))
      })
    })
  }

  getAll(collection, query) {
    return this.connect().then(db => {
      return db.collection(collection).find(query).toArray()
    })
  }
}

module.exports = MongoLib