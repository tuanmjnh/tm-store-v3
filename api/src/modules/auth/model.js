const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  remember: { type: Boolean, default: false },
  token: { type: String, required: true }
})
module.exports = mongoose.model('auth', schema)
