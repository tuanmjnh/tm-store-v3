const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  // type: { type: Number, required: true }, // 1 Import 2 Export
  code: { type: String, required: true, lowercase: true },
  products: { type: Number, default: 0 },
  quantities: { type: Number, default: 0 },
  prices: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
  createdAt: { type: Date, default: new Date() },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  createdIp: { type: String, default: null },
  flag: { type: Number, default: 1 }
})
module.exports = mongoose.model('product_imports', schema)
