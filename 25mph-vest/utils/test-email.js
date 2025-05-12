const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // ✅ Force exact path

console.log("🔍 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🔍 EMAIL_PASS:", process.env.EMAIL_PASS ? '✅ Loaded' : '❌ Missing');


const { sendOrderConfirmation } = require('./mailer');


sendOrderConfirmation('kasumurulokesh99@gmail.com', {
  userName: 'Test User',
  paypalOrderID: 'TEST123',
  totalAmount: 45.67,
  paymentStatus: 'Paid',
  orderStatus: 'Confirmed',
  shippingAddress: {
    fullName: 'Test User',
    addressLine1: '123 Test Ave',
    city: 'Testville',
    state: 'TS',
    postalCode: '12345',
    country: 'USA',
    mobile: '555-555-5555',
    email: 'your_email@gmail.com'
  },
  items: [
    { quantity: 1, product: '25MPH Vest', size: 'M' }
  ]
});
