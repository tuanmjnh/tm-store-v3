const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  key: { type: String, required: true, lowercase: true },
  value: { type: String, required: true, lowercase: true }
})
module.exports = mongoose.model('configs', schema)
