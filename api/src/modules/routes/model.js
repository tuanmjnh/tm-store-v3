const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  path: String,
  name: String,
  component: String,
  dependent: { type: mongoose.Schema.Types.ObjectId, default: null },
  level: { type: Number, default: 1 },
  redirect: { type: String, default: null },
  // title: { type: String, default: null },
  // icon: { type: String, default: null },
  orders: { type: Number, default: 1 },
  // hidden: { type: Boolean, default: false },
  meta: { type: Array, default: { title: '', icon: '', hidden: false } },
  flag: { type: Number, default: 1 },
  children: { type: Array, default: null },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } }
});
module.exports = mongoose.model('routes', schema)
