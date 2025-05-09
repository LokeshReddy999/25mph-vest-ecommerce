const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Inventory = require('../models/inventory');
const { sendOrderConfirmation } = require('../utils/mailer');

// Save order and update inventory
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    for (let item of req.body.items) {
      const productLower = item.product.toLowerCase();
      const inventoryType = productLower.includes('kid') ? 'kids' : 'adult';
      const size = item.size?.toUpperCase(); // normalize case
      const qty = parseInt(item.quantity);

      //console.log(`🔁 Processing: type=${inventoryType}, size=${size}, qty=${qty}`);

      // Validate inventory input
      const filter = { type: inventoryType, size: size };
      const update = { $inc: { quantity: -qty } };

      const updatedItem = await Inventory.findOneAndUpdate(filter, update, { new: true });

      if (!updatedItem) {
        console.warn(`⚠️ Inventory item not found with`, filter);
      } else {
        console.log(`✅ Inventory updated: ${updatedItem.type}-${updatedItem.size} => ${updatedItem.quantity}`);
      }
    }

    console.log("🧾 Incoming req.body.paypalOrderId:", req.body.paypalOrderId);
    console.log("📦 Mongoose order.paypalOrderId:", order.paypalOrderId);
    
    await sendOrderConfirmation(order.shippingAddress.email,
   {
      userName: order.shippingAddress.fullName,
      paypalOrderId: order.paypalOrderId,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      shippingAddress: order.shippingAddress,
      items: order.items,
    });
    

    res.status(201).json({ message: "Order saved and inventory updated" });
  } catch (err) {
    console.error("❌ Order saving or inventory update failed:", err);
    res.status(500).json({ error: "Order save/inventory update failed" });
  }
});


// Get orders by user email
router.get('/user/:email', async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve user orders" });
  }
});

// Admin: get all orders
router.get('/all', async (req, res) => {
  try {
    const allOrders = await Order.find().sort({ createdAt: -1 });
    res.json(allOrders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
});

module.exports = router;
