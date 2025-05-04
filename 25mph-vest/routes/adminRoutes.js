const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Inventory = require('../models/inventory');

// 📊 Dashboard Summary
router.get('/summary', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find();
    const totalAmount = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    const users = await User.countDocuments({ isAdmin: false });
    const inventory = await Inventory.find({});

    let kidsS = 0, adultM = 0, adultL = 0;
    inventory.forEach(item => {
      if (item.type === 'kids' && item.size === 'S') kidsS = item.quantity;
      if (item.type === 'adult' && item.size === 'M') adultM = item.quantity;
      if (item.type === 'adult' && item.size === 'L') adultL = item.quantity;
    });

    res.json({ totalOrders, totalAmount, kidsS, adultM, adultL, users });
  } catch (err) {
    console.error('Admin summary error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 👥 Users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ isAdmin: { $ne: true } });
    res.json(users);
  } catch (err) {
    console.error('Failed to fetch users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// 📦 Orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// 📋 Inventory
router.get('/inventory', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
});

router.post('/inventory/update', async (req, res) => {
  const { type, size, newQuantity } = req.body;
  const delta = parseInt(newQuantity); // Ensure it's a number

  if (isNaN(delta)) {
    return res.status(400).json({ message: 'Invalid quantity value' });
  }

  try {
    const item = await Inventory.findOne({ type, size });

    if (item) {
      item.quantity += delta;

      // Prevent negative quantity
      if (item.quantity < 0) item.quantity = 0;

      await item.save();
      res.json({ message: 'Inventory updated by delta', updated: item });

    } else {
      // If no inventory exists, only allow positive number
      if (delta < 0) {
        return res.status(400).json({ message: 'Cannot subtract from non-existing stock' });
      }

      const newItem = new Inventory({ type, size, quantity: delta });
      await newItem.save();
      res.json({ message: 'New inventory created', updated: newItem });
    }

  } catch (err) {
    console.error('Inventory update error:', err);
    res.status(500).json({ message: 'Server error during inventory update' });
  }
});

module.exports = router;
