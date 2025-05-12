require('dotenv').config();
console.log('🔍 Loaded MONGODB_URI:', process.env.MONGODB_URI);

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for JSON
app.use(express.json());

// HTML Routes (views)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/index.html', (req, res) => {
  res.redirect('/');
});

app.get('/images', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/images.html'));
});

app.get('/buy', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/buy.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});


app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.get('/homepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});


app.get('/checkout.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/checkout.html'));
});

app.get('/success.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/success.html'));
});

app.get('/order-history.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/order-history.html'));
});

app.get('/admin-dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/admin-dashboard.html'));
});



// Routes for APIs
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes); 


const inventoryRoutes = require('./routes/inventoryRoutes');
app.use('/api/inventory', inventoryRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
