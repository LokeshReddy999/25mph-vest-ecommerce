// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  userName: { type: String },
  paypalOrderId: { type: String, required: true },
  items: [
    {
      product: String,
      size: String,
      quantity: Number,
      price: Number,
      total: Number
    }
  ],
  totalAmount: { type: Number, required: true },

  
  shippingAddress: {
    fullName: { type: String },
    email: { type: String },       
    mobile: { type: String },       
    addressLine1: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },

  paymentStatus: { type: String, default: "Paid" },
  orderStatus: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
