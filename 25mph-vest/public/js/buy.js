/// Tab Toggle
document.getElementById("kidsBtn").onclick = async () => {
  document.getElementById("kidsSection").classList.add("show");
  document.getElementById("adultSection").classList.remove("show");
  document.getElementById("kidsBtn").classList.add("active");
  document.getElementById("adultBtn").classList.remove("active");

  await updateStockWarnings();
  loadSizeOptions('kids');
  updateCartCount();
};

document.getElementById("adultBtn").onclick = async () => {
  document.getElementById("kidsSection").classList.remove("show");
  document.getElementById("adultSection").classList.add("show");
  document.getElementById("kidsBtn").classList.remove("active");
  document.getElementById("adultBtn").classList.add("active");

  await updateStockWarnings();
  loadSizeOptions('adult');
  updateCartCount();
};


window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/inventory');
    const data = await res.json();

    data.forEach(item => {
      const container = item.type === 'kids'
        ? document.querySelector('#kidsSection .vest-info')
        : document.querySelector('#adultSection .vest-info');

      if (item.quantity < 15) {
        const warning = document.createElement('div');
        warning.className = 'low-stock';
        warning.textContent = `Only ${item.quantity} left in stock!`;
        container.prepend(warning);
      }
    });

    // 🆕 When page loads initially, show kids size dropdown by default
    loadSizeOptions('kids');
    updateCartCount();
  } catch (err) {
    console.error('Failed to load inventory info', err);
  }
});

// 🆕 Function to load Sizes dynamically
function loadSizeOptions(type) {
  let sizeSelect;
  if (type === 'kids') {
    sizeSelect = document.getElementById('kidsSize');
  } else {
    sizeSelect = document.getElementById('adultSize');
  }
  sizeSelect.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.text = '-- Select Size --';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  sizeSelect.appendChild(defaultOption);

  if (type === 'kids') {
    const option = document.createElement('option');
    option.value = 'S';
    option.text = 'Small (S)';
    sizeSelect.appendChild(option);
  } else if (type === 'adult') {
    ['M', 'L'].forEach(size => {
      const option = document.createElement('option');
      option.value = size;
      option.text = size === 'M' ? 'Medium (M)' : 'Large (L)';
      sizeSelect.appendChild(option);
    });
  }
}

// Quantity Update
function changeQty(id, change) {
  const input = document.getElementById(id);
  let current = parseInt(input.value);
  if (isNaN(current)) current = 1;
  current = Math.max(1, current + change);
  input.value = current;
  updateTotal(id.includes("kids") ? "kids" : "adult");
}

function updateTotal(type) {
  const qty = parseInt(document.getElementById(`${type}Quantity`).value);
  const total = (qty * 9.99).toFixed(2);
  document.getElementById(`${type}Total`).innerText = `$${total}`;
}

// Add to Cart
function addToCart(type) {
  const quantity = parseInt(document.getElementById(`${type}Quantity`).value);
  const size = document.getElementById(`${type}Size`).value;
  const unitPrice = 9.99;
  const total = (quantity * unitPrice).toFixed(2);

  if (!size || size === '-- Select Size --') {
    alert("Please select a valid size.");
    return;
  }

  const item = {
    product: type === "kids" ? "Kids 25mph Vest" : "Adult 25mph Vest",
    size,
    quantity,
    price: unitPrice,
    total
  };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
}

// Go to Checkout
function goToCheckout(type) {
  addToCart(type);
  window.location.href = "/checkout.html";
}

// Cart badge
function updateCartCount() {
  const count = JSON.parse(localStorage.getItem("cart"))?.length || 0;
  const badge = document.getElementById("cart-count");
  badge.innerText = count;
  badge.classList.add("bump");
  setTimeout(() => badge.classList.remove("bump"), 400);
}
async function updateStockWarnings() {
  try {
    const res = await fetch('/api/inventory');
    const data = await res.json();

    // Remove existing warnings
    document.querySelectorAll('.low-stock').forEach(el => el.remove());

    data.forEach(item => {
      // Choose correct container based on type
      const section = item.type === 'kids'
        ? document.querySelector('#kidsSection .vest-info')
        : document.querySelector('#adultSection .vest-info');

      // Target a unique warning ID for each size
      const warningId = `${item.type}-${item.size}-stock-warning`;
      const existingWarning = document.getElementById(warningId);
      if (existingWarning) existingWarning.remove();

      if (item.quantity < 15) {
        const warning = document.createElement('div');
        warning.className = 'low-stock';
        warning.id = warningId;
        warning.textContent = `Only ${item.quantity} left in stock (${item.size})!`;

        section.prepend(warning);
      }
    });
  } catch (err) {
    console.error(' Failed to fetch inventory:', err);
  }
}


