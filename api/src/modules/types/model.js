const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  key: { type: String, required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  desc: { type: String, default: null },
  meta: { type: Array, default: null },
  orders: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } }
})

// schema.post('save', () => console.log('Hello from pre save'))
// schema.post('updateOne', (doc) => console.log(doc))
// schema.post('find', () => console.log('Hello from pre find'))

module.exports = mongoose.model('types', schema)
