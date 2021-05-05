const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  // type: { type: String, default: null },
  categories: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
  title: { type: String, required: true },
  code: { type: String, default: null, uppercase: true },
  desc: { type: String, default: null },
  content: { type: String, default: null },
  url: { type: String, default: null },
  images: { type: String, default: null },
  author: { type: String, default: null },
  date: { type: Date, default: null },
  pin: { type: Array, default: null },
  tags: { type: Array, default: null },
  attr: { type: Array, default: null },
  meta: { type: Array, default: null },
  attach: { type: Array, default: null },
  startAt: { type: Date, default: null },
  endAt: { type: Date, default: null },
  orders: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
});
module.exports = mongoose.model('news', schema);
schema.index({ code: 'text', title: 'text', author: 'text' });
