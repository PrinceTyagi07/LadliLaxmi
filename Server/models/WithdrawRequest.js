const mongoose = require('mongoose');

const withdrawRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  status: { type: String, default: 'pending' }, // pending, approved, rejected
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WithdrawRequest', withdrawRequestSchema);
