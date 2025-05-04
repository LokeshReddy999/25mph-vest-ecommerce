// welcome.js

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

  // DROPDOWN LOGIC: open on click, stable until clicked outside
  if (welcomeUser && profileMenu) {
    let dropdownOpen = false;

    welcomeUser.addEventListener('click', (e) => {
      e.stopPropagation(); 
      dropdownOpen = !dropdownOpen;
      profileMenu.style.display = dropdownOpen ? 'block' : 'none';
    });

    profileMenu.addEventListener('click', (e) => {
      e.stopPropagation(); 
    });

    document.addEventListener('click', () => {
      if (dropdownOpen) {
        dropdownOpen = false;
        profileMenu.style.display = 'none';
      }
    });
  }
});
