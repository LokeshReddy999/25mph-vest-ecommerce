let cart = JSON.parse(localStorage.getItem("cart")) || [];
const container = document.getElementById("checkout-summary");

// ✅ Merge same items (same product & size)
const merged = {};

cart.forEach(item => {
  const key = item.product + '_' + item.size;
  if (merged[key]) {
    merged[key].quantity += item.quantity;
    merged[key].total = (merged[key].quantity * item.price).toFixed(2);
  } else {
    merged[key] = { ...item }; // clone
  }
});

cart = Object.values(merged);
localStorage.setItem("cart", JSON.stringify(cart));

function updateDisplay() {
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.style = "border:1px solid #ddd;padding:15px;margin-bottom:10px;border-radius:8px;background:#fff;";
    div.innerHTML = `
      <h3>${item.product}</h3>
      <p>👕 Size: <strong>${item.size}</strong></p>
      <p>
        🔢 Quantity:
        <button onclick="changeQty(${index}, -1)">−</button>
        <strong>${item.quantity}</strong>
        <button onclick="changeQty(${index}, 1)">+</button>
      </p>
      <p>💵 Total: <strong>$${item.total}</strong></p>
      <button onclick="removeItem(${index})" style="background:#ff4d4d;color:white;padding:6px 12px;border:none;border-radius:5px;cursor:pointer;">🗑 Remove</button>
    `;

    container.appendChild(div);
    total += parseFloat(item.total);
  });

  const summary = document.createElement("h2");
  summary.style = "text-align:right; margin-top:20px;";
  summary.innerText = `Total to Pay: $${total.toFixed(2)}`;
  container.appendChild(summary);
}

function changeQty(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  cart[index].total = (cart[index].quantity * cart[index].price).toFixed(2);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateDisplay();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateDisplay();
}

updateDisplay();
