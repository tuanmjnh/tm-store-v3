const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  key: { type: mongoose.Schema.Types.ObjectId, ref: 'product_imports', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  price: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  // amount: { type: Number, default: 0 }
})
module.exports = mongoose.model('product-import-items', schema)
