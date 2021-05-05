const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  collName: { type: String, required: true },
  collId: { type: mongoose.Schema.Types.ObjectId, required: true },
  method: { type: String, required: true },
  userAgent: { type: String, required: true },
  at: { type: Date, default: new Date() },
  ip: { type: String, required: true },
});
module.exports = mongoose.model('logs', schema);
