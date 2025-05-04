const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  orders: [
    {
      vestType: String,
      quantity: Number,
      size: String,
      totalPrice: Number,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model('OrderHistory', orderHistorySchema);
