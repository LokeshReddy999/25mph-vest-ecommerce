const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register route
router.post('/register', async (req, res) => {
  console.log('Register route hit');              // ✅ Log for debug
  console.log('Data:', req.body);                 // ✅ Log data received

  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ fullName, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(' Registration Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Send user data and whether they are an admin
    res.status(200).json({
      user: {
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin || false
      }
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
