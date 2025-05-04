document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const table = document.getElementById('orderHistoryTable');
  const tbody = table.querySelector('tbody');
  const noOrdersText = document.getElementById('orderHistoryText');

  if (!email) {
    table.style.display = 'none';
    noOrdersText.style.display = 'block';
    noOrdersText.textContent = 'Please log in to view your orders.';
    return;
  }

  fetch(`/api/orders/user/${email}`)
    .then(res => res.json())
    .then(orders => {
      if (!orders.length) {
        table.style.display = 'none';
        noOrdersText.style.display = 'block';
        noOrdersText.textContent = 'You have no orders yet.';
        return;
      }

      orders.forEach(order => {
        order.items.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${new Date(order.createdAt).toLocaleString()}</td>
            <td>${item.product}</td>
            <td>${item.size}</td>
            <td>${item.quantity}</td>
            <td>$${item.total.toFixed(2)}</td>
            <td>${order.paymentStatus}</td>
            <td>${order.orderStatus === "Pending" ? "Confirmed" : order.orderStatus}</td>
          `;
          tbody.appendChild(row);
        });
      });
    })
    .catch(err => {
      console.error("Error fetching orders:", err);
      table.style.display = 'none';
      noOrdersText.style.display = 'block';
      noOrdersText.textContent = 'Error loading orders.';
    });
});
