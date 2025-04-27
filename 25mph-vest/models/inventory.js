const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['kids', 'adult']
  },
  size: {
    type: String,
    required: true,
    enum: ['S', 'M', 'L']
  },
  quantity: {
    type: Number,
    required: true
  }
}, { timestamps: true });

inventorySchema.index({ type: 1, size: 1 }, { unique: true });

module.exports = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);
