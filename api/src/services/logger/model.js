const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  UID: { type: String, required: true },
  name: { type: String, required: true },
  id: { type: String, required: true },
  method: { type: String, required: true },
  agent: { type: String, required: true },
  at: { type: Date, default: new Date() },
  ip: { type: String, required: true }
})
module.exports = mongoose.model('logs', schema)
