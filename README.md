# 25mph Safety Vest E-commerce Website

This project is a full-stack e-commerce platform designed to promote safe walking by selling 25mph visibility vests for kids and adults. It includes secure login, product selection, dynamic pricing, PayPal payments, email confirmations, and an admin dashboard.

---

##  Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (NoSQL)
- **Authentication:** Session-based with Express-Session
- **Payment Integration:** PayPal SDK (Sandbox)
- **Email Notifications:** Nodemailer
- **Deployment:** Localhost or any Node.js-compatible server

---

##  How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/master-projects-theses/2025-spring-LokeshReddy.Kasumuru.git
cd 25mph vest
```

### 2. Install Dependencies

Ensure Node.js is installed (`node -v` and `npm -v` to verify).

```bash
npm install
```

### 3. Required NPM Packages

These are the core packages used in the project:

```bash
npm install express mongoose dotenv body-parser nodemailer express-session
npm install @paypal/checkout-server-sdk
pip install homebrew
```

---

##  Environment Variables

Create a `.env` file in the root directory with the following content:

```
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_key
```

---

## Running the Application

```bash
node server.js
```

Open your browser and go to:  
 `http://localhost:3000`

---

##  Project Structure

```
25mph-vest/
├── models/
│   ├── inventory.js
│   ├── Order.js
│   ├── OrderHistory.js
│   └── User.js
├── node_modules/
├── public/
│   ├── css/
│   │   ├── admin-dashboard.css
│   │   ├── buy-style.css
│   │   ├── homepage.css
│   │   ├── login-style.css
│   │   ├── order-history.css
│   │   └── style.css
│   ├── images/
│   │   ├── adult-vest.png
│   │   ├── kids-vest.png
│   │   ├── school.jpg
│   │   ├── size1.png
│   │   ├── size2.png
│   │   ├── vest-bg.png
│   │   ├── vest-icon.png
│   │   ├── vest.png
│   │   └── walking.jpeg
│   └── js/
│       ├── admin-dashboard.js
│       ├── buy.js
│       ├── checkout.js
│       ├── homepage.js
│       ├── login.js
│       ├── order-history.js
│       ├── profile.js
│       └── welcome.js
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── inventoryRoutes.js
│   ├── orderRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── mailer.js
│   └── test-email.js
├── views/
│   ├── admin-dashboard.html
│   ├── buy.html
│   ├── checkout.html
│   ├── index.html
│   ├── login.html
│   ├── old.html
│   ├── order-history.html
│   └── success.html
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md

```

---

##  Features

-  Secure registration and login with session management
- Dynamic product selection with size/quantity options
-  Real-time price calculation
- PayPal Sandbox payment gateway
-  Confirmation email after successful order
- Admin Dashboard to manage:
  - Inventory
  - Registered Users
  - Order History
  - Revenue Summary

---

##  Admin Access

To access the Admin Dashboard:
- Visit `/login`
- Use a predefined admin account, Check database or store a document in Users as isadmin=true
- Redirects to `/admin-dashboard` with full control panel

---

##  Email Confirmation

Upon successful checkout:
- User receives a confirmation email
- Includes order details and delivery info
- Sent using Nodemailer with secure SMTP

---

## Future Enhancements

- Migrate to React for frontend (full MERN)
- Add product filtering, search, and reviews
- Responsive mobile-first UI using Bootstrap or Tailwind

---

##  Author

**Lokesh Reddy Kasumuru**  
Master’s Project in Information Technology  
University of New Hampshire  
 LokeshReddy.Kasumuru@unh.edu

