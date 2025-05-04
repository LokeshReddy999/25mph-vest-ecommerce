let cart = JSON.parse(localStorage.getItem("cart")) || [];
const container = document.getElementById("checkout-summary");
const totalAmountEl = document.getElementById("total-amount");

// Merge same items
const merged = {};
cart.forEach(item => {
  const key = item.product + '_' + item.size;
  if (merged[key]) {
    merged[key].quantity += item.quantity;
    merged[key].total = (merged[key].quantity * item.price).toFixed(2);
  } else {
    merged[key] = { ...item };
  }
});
cart = Object.values(merged);
localStorage.setItem("cart", JSON.stringify(cart));

function updateDisplay() {
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalAmountEl.innerText = "$0.00";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <h3>${item.product}</h3>
      <div class="cart-item-top">
        <span>👕 Size: <strong>${item.size}</strong></span>
        <span>🔢 
          <button onclick="changeQty(${index}, -1)">−</button>
          <strong>${item.quantity}</strong>
          <button onclick="changeQty(${index}, 1)">+</button>
        </span>
      </div>
      <div class="cart-item-bottom">
        <span>💵 Total: <strong>$${item.total}</strong></span>
        <button class="remove-btn" onclick="removeItem(${index})">🗑 Remove</button>
      </div>
    `;

    container.appendChild(div);
    total += parseFloat(item.total);
  });

  totalAmountEl.innerText = `$${total.toFixed(2)}`;
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
