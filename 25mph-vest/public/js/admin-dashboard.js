let originalOrders = []; // Global orders list

document.getElementById('logoutBtn').addEventListener('click', function (e) {
  e.preventDefault();
  // Optionally clear session or localStorage here
  localStorage.clear();
  sessionStorage.clear();

  // Redirect to login page
  window.location.href = '/login.html';
});


document.addEventListener('DOMContentLoaded', async () => {
  const productTypeSelect = document.getElementById('productType');
  const sizeSelect = document.getElementById('productSize');
  const dateInput = document.getElementById('filterDate');

  // Optional: Prevent selecting future dates
  if (dateInput) {
    dateInput.max = new Date().toISOString().split("T")[0];
  }

  function updateSizeOptions(type) {
    if (!sizeSelect) return;
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

  if (productTypeSelect && sizeSelect) {
    updateSizeOptions(productTypeSelect.value);
    productTypeSelect.addEventListener('change', () => {
      updateSizeOptions(productTypeSelect.value);
    });
  }

  try {
    const [summaryRes, usersRes, ordersRes] = await Promise.all([
      fetch('/api/admin/summary'),
      fetch('/api/admin/users'),
      fetch('/api/admin/orders')
    ]);

    const summary = await summaryRes.json();
    const users = await usersRes.json();
    const orders = await ordersRes.json();

    const revenue = typeof summary.totalAmount === 'number' ? summary.totalAmount : 0;
    document.getElementById('totalOrders').textContent = summary.totalOrders;
    document.getElementById('totalRevenue').textContent = revenue.toFixed(2);

    originalOrders = orders;
    populateOrderTable(originalOrders);
    populateCustomerTable(users);

  } catch (error) {
    console.error('Error loading admin data:', error);
    alert('Failed to load admin dashboard. Please check the console.');
  }

  const form = document.getElementById('inventoryForm');
  if (form && productTypeSelect && sizeSelect) {
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

  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.tab;

      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(tab => tab.classList.remove('active'));

      button.classList.add('active');
      document.getElementById(targetId).classList.add('active');
    });
  });

  loadInventoryTable(); // Initial inventory load
});

// Format yyyy-mm-dd to m/d/yyyy
function formatDateToMMDDYYYY(yyyyMMdd) {
  const [year, month, day] = yyyyMMdd.split("-");
  return `${parseInt(month)}/${parseInt(day)}/${year}`;
}

function populateOrderTable(orders) {
  const tbody = document.querySelector('#ordersTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const nameFilter = document.getElementById('filterName')?.value.toLowerCase() || '';
  const productFilter = document.getElementById('filterProduct')?.value.toLowerCase() || '';
  const dateFilter = document.getElementById('filterDate')?.value;

  orders
    .filter(order => {
      const item = order.items[0] || {};
      const orderDate = new Date(order.createdAt);
      const formattedOrderDate = `${orderDate.getMonth() + 1}/${orderDate.getDate()}/${orderDate.getFullYear().toString().slice(-2)}`; // 5/1/25

      return (
        (!nameFilter || (order.userName || '').toLowerCase().includes(nameFilter)) &&
        (!productFilter || (item.product || '').toLowerCase().includes(productFilter)) &&
        (!dateFilter || formattedOrderDate === dateFilter)
      );
    })
    .forEach(order => {
      const item = order.items[0] || {};
      const addr = order.shippingAddress || {};

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.userName || '-'}</td>
        <td>${item.product || '-'}</td>
        <td>${item.size || '-'}</td>
        <td>${item.quantity || '-'}</td>
        <td>$${(order.totalAmount || 0).toFixed(2)}</td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        <td>${addr.addressLine1 || '-'}</td>
        <td>${addr.city || '-'}</td>
        <td>${addr.state || '-'}</td>
        <td>${addr.postalCode || '-'}</td>
        <td>${addr.mobile || '-'}</td>
      `;
      tbody.appendChild(row);
    });
}

// Populate customers table
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

// Inventory table
async function loadInventoryTable() {
  try {
    const res = await fetch('/api/inventory');
    const data = await res.json();
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.type}</td>
        <td>${item.size}</td>
        <td class="${item.quantity < 15 ? 'low-stock' : 'okay-stock'}">${item.quantity}</td>
        <td>
          <div class="qty-control">
            <button class="qty-icon" onclick="adjustQty('${item._id}', -1)">−</button>
            <input type="number" value="0" id="change-${item._id}" class="qty-box" />
            <button class="qty-icon" onclick="adjustQty('${item._id}', 1)">+</button>
          </div>
        </td>
        <td>
          <button onclick="updateInventory('${item.type}', '${item.size}', '${item._id}')">Update</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Failed to load inventory:", err);
  }
}

// Inventory update
async function updateInventory(type, size, id) {
  const qtyInput = document.getElementById(`qty-${id}`);
  const qtyChange = parseInt(qtyInput.value);
  if (isNaN(qtyChange)) return alert("Enter a valid number");

  const res = await fetch('/api/admin/inventory/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, size, newQuantity: qtyChange })
  });

  const result = await res.json();
  alert(result.message || 'Inventory updated!');
  loadInventoryTable();
}

// Filters
function applyOrderFilters() {
  populateOrderTable(originalOrders);
}

function resetOrderFilters() {
  document.getElementById('filterName').value = '';
  document.getElementById('filterProduct').value = '';
  document.getElementById('filterDate').value = '';
  populateOrderTable(originalOrders);
}

// Admin dropdown toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('adminToggle');
  const dropdown = document.getElementById('adminDropdown');

  if (toggle && dropdown) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
      dropdown.style.display = 'none';
    });

    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  flatpickr("#filterDate", {
    dateFormat: "n/j/y",      
    altInput: false,          
    allowInput: true
  });
  
  
});

function adjustQty(id, change) {
  const input = document.getElementById(`change-${id}`);
  let current = parseInt(input.value) || 0;
  current += change;
  input.value = current;
}

async function updateInventory(type, size, id) {
  const qtyInput = document.getElementById(`change-${id}`);
  const qtyChange = parseInt(qtyInput.value);
  if (isNaN(qtyChange)) return alert("Enter a valid number");

  const res = await fetch('/api/admin/inventory/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, size, newQuantity: qtyChange })
  });

  const result = await res.json();
  alert(result.message || 'Inventory updated!');
  loadInventoryTable(); // reload after update
}


