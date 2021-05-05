const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  // type: { type: Number, required: true }, // 1 Import; 2 Export
  code: { type: String, required: true, lowercase: true },
  product: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  vat: { type: Number, default: 0 },
  createdAt: { type: Date, default: new Date() },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  createdIp: { type: String, default: null },
  flag: { type: Number, default: 1 },
});
module.exports = mongoose.model('product_exports', schema);
