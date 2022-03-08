const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  darkMode: { type: Boolean, default: false },
  language: { type: String, default: 'vi-VN' },
  unitPrice: { type: String, default: 'vnd' },
  font: {
    type: Object,
    default: {
      size: 14,
      family: '"Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif',
      color: '#6b6b6b',
      lineHeight: 1.5
    }
  },
  format: {
    type: Object,
    default: {
      date: 'DD/MM/YYYY',
      time: 'hh:mm:ss'
    }
  },
  dense: {
    type: Object,
    default: {
      form: true,
      button: true,
      input: true,
      table: true,
      menu: false
    }
  },
  shadow: {
    type: Object,
    default: {
      table: false
    }
  }
})

module.exports = mongoose.model('settings', schema)
