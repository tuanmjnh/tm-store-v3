const mongoose = require('mongoose')
// const Schema = mongoose.Schema
const schema = new mongoose.Schema({
  group: { type: String, default: null },
  username: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  fullName: { type: String, default: null },
  email: { type: String, required: true },
  phone: { type: String, default: null },
  personNumber: { type: String, default: null },
  region: { type: String, default: 'vi-vn' },
  avatar: { type: Array, default: null },
  note: { type: String, default: null },
  dateBirth: { type: Date, default: null },
  gender: { type: String, default: null },
  address: { type: String, default: null },
  roles: { type: Array, default: null },
  verified: { type: Boolean, default: false },
  enable: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  lastChangePass: { type: Date, default: null },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } }
})
module.exports = mongoose.model('users', schema)
