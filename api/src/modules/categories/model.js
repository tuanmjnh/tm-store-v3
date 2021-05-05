const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  type: { type: String, required: true },
  dependent: { type: mongoose.Schema.Types.ObjectId, default: null },
  level: { type: Number, default: 1 },
  title: { type: String, required: true },
  code: { type: String, required: true, uppercase: true },
  desc: { type: String, default: null },
  content: { type: String, default: null },
  url: { type: String, default: null },
  images: { type: String, default: null },
  quantity: { type: Number, default: null },
  position: { type: Array, default: [1] },
  tags: { type: Array, default: null },
  icon: { type: String, default: null },
  color: { type: String, default: null },
  meta: { type: Array, default: null },
  startAt: { type: Date, default: null },
  endAt: { type: Date, default: null },
  orders: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
});
module.exports = mongoose.model('categories', schema);
