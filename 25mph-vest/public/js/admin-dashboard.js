window.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('/api/admin/summary');
    const data = await res.json();
  
    document.getElementById('totalOrders').textContent = `📦 Total Orders: ${data.totalOrders}`;
    document.getElementById('totalPayment').textContent = `💰 Total Payment: $${data.totalAmount}`;
    document.getElementById('inventory').textContent = `📊 Inventory - Kids: ${data.kids}, Adults: ${data.adults}`;
    document.getElementById('customers').textContent = `🧑‍🤝‍🧑 Customers: ${data.users}`;
  });
  
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  });
  