const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  // type: { type: String, default: null },
  categories: { type: Array, default: null },
  // categories: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true },
  // subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'subCategory', required: true },
  title: { type: String, required: true },
  code: { type: String, required: true, uppercase: true },
  desc: { type: String, default: null },
  content: { type: String, default: null },
  images: { type: Array, default: null },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  priceDiscount: { type: Number, default: 0 },
  priceImport: { type: Number, default: 0 },
  priceExport: { type: Number, default: 0 },
  priceUnit: { type: String, default: null }, // { type: mongoose.Schema.Types.ObjectId, ref: 'types' },
  unit: { type: String, default: null }, // { type: mongoose.Schema.Types.ObjectId, ref: 'types' },
  origin: { type: String, default: null },
  date: { type: String, default: null },
  pins: { type: Array, default: null },
  tags: { type: Array, default: null },
  attr: { type: Array, default: null },
  meta: { type: Array, default: null },
  imei: { type: Number, default: null },
  qrcode: { type: Number, default: null },
  // start_at: { type: Date, default: null },
  // end_at: { type: Date, default: null },
  order: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } }
})
module.exports = mongoose.model('products', schema)
schema.index({ code: 'text', title: 'text', origin: 'text' })
