const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  desc: { type: String, default: null },
  level: { type: Number, default: 1 },
  color: { type: String, default: '#027be3' },
  routes: { type: Array, default: null },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } }
  // type: 'personal',
  // order: 1,
})
module.exports = mongoose.model('roles', schema)
