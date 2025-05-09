const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const nodemailer = require('nodemailer'); 

console.log("🔍 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🔍 EMAIL_PASS:", process.env.EMAIL_PASS ? '✅ Loaded' : '❌ Missing');

// Create the transporter using your email service (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Change this to your email provider if different
  auth: {
    user: process.env.EMAIL_USER,  // Your email address (set in your .env file)
    pass: process.env.EMAIL_PASS,  // Your email password (set in your .env file)
  },
});

// Function to send order confirmation email
const sendOrderConfirmation = async (to, orderDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender address
    to,  // Receiver address
    subject: 'Your 25MPH Vest Order Confirmation',
    html: `
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
    <table style="max-width: 600px; background: white; margin: auto; border-radius: 10px; padding: 20px; border-collapse: collapse;">
      <tr>
        <td style="text-align: center;">
          <h2 style="color: #28c028; text-align: center;">Thank you for your order, ${orderDetails.userName || ''}!</h2>

          <p style="color: #555; font-size: 14px;">We've received your order and it's being processed.</p>
        </td>
      </tr>

      <tr><td><h3 style="color: #28c028;">📋 Order Summary</h3></td></tr>
      <tr>
        <td>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px; border: 1px solid #ccc;"><b>PayPal Order ID</b></td><td style="padding: 8px; border: 1px solid #ccc;">${orderDetails.paypalOrderId}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc;"><b>Total Amount</b></td><td style="padding: 8px; border: 1px solid #ccc;">$${orderDetails.totalAmount}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc;"><b>Payment Status</b></td><td style="padding: 8px; border: 1px solid #ccc;">${orderDetails.paymentStatus}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc;"><b>Order Status</b></td><td style="padding: 8px; border: 1px solid #ccc;">${orderDetails.orderStatus}</td></tr>
          </table>
        </td>
      </tr>

      <tr><td><h3 style="color: #28c028;">📦 Shipping Address</h3></td></tr>
      <tr>
        <td style="font-size: 14px; padding: 10px;">
          ${orderDetails.shippingAddress.fullName}<br>
          ${orderDetails.shippingAddress.addressLine1}<br>
          ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} - ${orderDetails.shippingAddress.postalCode}<br>
          ${orderDetails.shippingAddress.country}<br>
          Mobile: ${orderDetails.shippingAddress.mobile}<br>
          Email: <a href="mailto:${orderDetails.shippingAddress.email}">${orderDetails.shippingAddress.email}</a>
        </td>
      </tr>

      <tr><td><h3 style="color: #28c028;">🛍️ Items Ordered</h3></td></tr>
      <tr>
        <td style="font-size: 14px; padding: 10px;">
          <ul>
            ${orderDetails.items.map(item => `<li>${item.quantity} × ${item.product} (Size: ${item.size})</li>`).join('')}
          </ul>
        </td>
      </tr>

      <tr>
        <td style="font-size: 13px; font-weight: bold; color: #28c028; padding: 10px;">🚚 Your order will be delivered within 14 days.</td>
      </tr>

      <tr>
        <td style="font-size: 12px; color: #777; text-align: center; padding-top: 15px;">
          If you have questions, reply to this email. Thank you for shopping with us!
        </td>
      </tr>
    </table>
  </div>

`,

  };

  try {
    await transporter.sendMail(mailOptions); // Sending the email
    console.log(`📧 Confirmation email sent to ${to}`);
  } catch (err) {
    console.error('❌ Failed to send confirmation email:', err);
  }
};

// Export the function so it can be used in other files
module.exports = { sendOrderConfirmation };
