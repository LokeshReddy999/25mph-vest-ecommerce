// Tab Toggle
document.getElementById("kidsBtn").onclick = () => {
    document.getElementById("kidsSection").classList.add("show");
    document.getElementById("adultSection").classList.remove("show");
    document.getElementById("kidsBtn").classList.add("active");
    document.getElementById("adultBtn").classList.remove("active");
  };
  
  document.getElementById("adultBtn").onclick = () => {
    document.getElementById("kidsSection").classList.remove("show");
    document.getElementById("adultSection").classList.add("show");
    document.getElementById("kidsBtn").classList.remove("active");
    document.getElementById("adultBtn").classList.add("active");
  };
  
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
  
    if (!size) {
      alert("Please select a size.");
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
  
  document.addEventListener("DOMContentLoaded", updateCartCount);
  