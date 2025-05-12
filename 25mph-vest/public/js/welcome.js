window.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const loginNavItem = document.getElementById('loginNavItem');
  const userDropdown = document.getElementById('userDropdown');
  const welcomeUser = document.getElementById('welcomeUser');
  const profileMenu = document.getElementById('profileMenu');

  if (user && user.fullName) {
    const firstName = user.fullName.split(' ')[0];
    if (loginNavItem) loginNavItem.style.display = 'none';
    if (userDropdown) userDropdown.style.display = 'flex';
    welcomeUser.textContent = user.isAdmin ? `👤 Welcome Admin` : `👤 Welcome ${firstName}`;
  } else {
    if (userDropdown) userDropdown.style.display = 'none';
    if (loginNavItem) loginNavItem.style.display = 'block';
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      window.location.href = '/login';
    });
  }

  // DROPDOWN LOGIC
  if (welcomeUser && profileMenu) {
    let dropdownOpen = false;
    welcomeUser.addEventListener('click', (e) => {
      e.stopPropagation(); 
      dropdownOpen = !dropdownOpen;
      profileMenu.style.display = dropdownOpen ? 'block' : 'none';
    });
    profileMenu.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => {
      if (dropdownOpen) {
        dropdownOpen = false;
        profileMenu.style.display = 'none';
      }
    });
  }

  // 🛒 Show cart icon if items exist in cart (MOVED INSIDE DOMContentLoaded)
  const cartNavItem = document.getElementById('cartNavItem');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length > 0) {
    if (cartNavItem) {
      cartNavItem.style.display = 'inline-block';
      const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
      const badge = document.getElementById('cart-count');
      if (badge) badge.innerText = totalQty;
    }
  } else {
    if (cartNavItem) cartNavItem.style.display = 'none';
  }
});
