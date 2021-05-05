const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  key: { type: String, required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  desc: { type: String, default: null },
  meta: { type: Array, default: null },
  orders: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } }
});
module.exports = mongoose.model('types', schema);
