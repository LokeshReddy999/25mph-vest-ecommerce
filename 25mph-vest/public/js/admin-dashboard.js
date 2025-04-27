document.addEventListener('DOMContentLoaded', async () => {
    const productTypeSelect = document.getElementById('productType');
    const sizeSelect = document.getElementById('productSize');
  
    // Dynamically adjust size options
    function updateSizeOptions(type) {
      sizeSelect.innerHTML = '';
      if (type === 'kids') {
        sizeSelect.innerHTML = '<option value="S">S</option>';
      } else if (type === 'adult') {
        sizeSelect.innerHTML = `
          <option value="M">M</option>
          <option value="L">L</option>
        `;
      }
    }
  
    // Initial size load
    if (productTypeSelect) {
      updateSizeOptions(productTypeSelect.value);
      productTypeSelect.addEventListener('change', () => {
        updateSizeOptions(productTypeSelect.value);
      });
    }
  
    // ✅ Fetch dashboard data
    try {
      const [summaryRes, usersRes, ordersRes] = await Promise.all([
        fetch('/api/admin/summary'),
        fetch('/api/admin/users'),
        fetch('/api/admin/orders')
      ]);
  
      const summary = await summaryRes.json();
      const users = await usersRes.json();
      const orders = await ordersRes.json();
  
      // ✅ Update KPI Cards
      document.getElementById('totalOrders').textContent = summary.totalOrders;
      document.getElementById('totalRevenue').textContent = `$${summary.totalAmount.toFixed(2)}`;
      document.getElementById('kidsInventory').textContent = `Kids (S): ${summary.kidsS}`;
      document.getElementById('adultInventory').textContent = `Adults (M): ${summary.adultM}, (L): ${summary.adultL}`;
  
      populateOrderTable(orders);
      populateCustomerTable(users);
  
    } catch (error) {
      console.error('Error loading admin data:', error);
      alert('Failed to load admin dashboard. Please check the console.');
    }
  
    // ✅ Handle inventory update form
    const form = document.getElementById('inventoryForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const type = productTypeSelect.value;
        const size = sizeSelect.value;
        const newQuantity = parseInt(document.getElementById('newQuantity').value);
  
        try {
          const res = await fetch('/api/admin/inventory/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, size, newQuantity })
          });
  
          const result = await res.json();
          alert(result.message || 'Inventory updated!');
          window.location.reload();
        } catch (err) {
          console.error('Inventory Update Error:', err);
          alert('Failed to update inventory.');
        }
      });
    }
  });
  
  // ✅ Populate Orders Table
  function populateOrderTable(orders) {
    const tbody = document.querySelector('#ordersTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
  
    orders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.userName}</td>
        <td>${order.product}</td>
        <td>${order.size}</td>
        <td>${order.quantity}</td>
        <td>$${order.totalPrice.toFixed(2)}</td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // ✅ Populate Customers Table
  function populateCustomerTable(users) {
    const tbody = document.querySelector('#customersTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
  
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.isAdmin ? 'Admin' : 'Customer'}</td>
      `;
      tbody.appendChild(row);
    });
  }
  