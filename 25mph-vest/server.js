const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/images', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/images.html'));
});

app.get('/buy', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/buy.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/vest-store', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
