import mongoose from 'mongoose'
import { dbURI } from '../config/environment.js'

export function connectDb() {
  return mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
}

export function truncateDb() {
  return mongoose.connection.db.dropDatabase()
  // if (mongoose.connection.readyState !== 0) {
  //   const { collections } = mongoose.connection

  //   const promises = Object.keys(collections).map(collection => {
  //     return mongoose.connection.collection(collection).deleteMany({})
  //   })

  //   return Promise.all(promises)
  // }
}


export function disconnectDb() {
  if (mongoose.connection.readyState !== 0) {
    return mongoose.disconnect()
  }
}
