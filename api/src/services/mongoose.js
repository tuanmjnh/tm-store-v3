const mongoose = require('mongoose')
// mongoose initialize
module.exports.initialize = function () {
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false,
    // replSet: { readPreference: 'ReadPreference.NEAREST' }
  }
  mongoose.connect(process.env.MONGODB, opts).then(
    () => { console.log('Database connection is successful') },
    err => { console.log(`Error when connecting to the database ${err}`) }
  )
}
//  rs.initiate()
// const MongoClient = require('mongodb').MongoClient;
// const client = new MongoClient(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
// client.connect(() => {
//   client.close()
// })
// console.log(client)

// mongoose.set('debug', (coll, method, query, doc, options) => {
//   console.log(`${coll}.${method}`, JSON.stringify(query), doc, options);
// })
