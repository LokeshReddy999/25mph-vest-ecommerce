const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory');

router.post('/update', async (req, res) => {
  const { type, size, newQuantity } = req.body;

  try {
    const updated = await Inventory.findOneAndUpdate(
      { type, size },
      { quantity: newQuantity },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ message: 'Inventory updated', inventory: updated });
  } catch (error) {
    console.error('Inventory update error:', error);
    res.status(500).json({ message: 'Server error while updating inventory' });
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find({});
    res.status(200).json(items);
  } catch (error) {
    console.error('Fetch inventory error:', error);
    res.status(500).json({ message: 'Server error fetching inventory' });
  }
});

module.exports = router;
