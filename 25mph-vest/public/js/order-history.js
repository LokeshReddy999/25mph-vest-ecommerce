document.addEventListener('DOMContentLoaded', () => {
    // Replace this with dynamic email (after login integration)
    const email = localStorage.getItem("userEmail"); 
  
    if (!email) {
      document.getElementById('order-list').innerHTML = "<p style='text-align:center;'>Please log in to view your orders.</p>";
      return;
    }
  
    fetch(`/api/orders/user/${email}`)
      .then(res => res.json())
      .then(orders => {
        const container = document.getElementById('order-list');
        if (!orders.length) {
          container.innerHTML = "<p style='text-align:center;'>You have no orders yet.</p>";
          return;
        }
  
        orders.forEach(order => {
          const div = document.createElement("div");
          div.style = "border:1px solid #ccc; border-radius:8px; padding:20px; margin-bottom:20px; background:#fff";
  
          div.innerHTML = `
            <h3>🧾 Order ID: <small>${order._id}</small></h3>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> ${order.orderStatus}</p>
            <ul style="padding-left: 20px;">
              ${order.items.map(item => `
                <li>
                  ${item.product} - Size: ${item.size}, Qty: ${item.quantity}, Total: $${item.total}
                </li>`).join('')}
            </ul>
            <p><strong>Total Paid:</strong> $${order.totalAmount}</p>
          `;
  
          container.appendChild(div);
        });
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        document.getElementById('order-list').innerHTML = "<p>Error loading orders.</p>";
      });
  });
  