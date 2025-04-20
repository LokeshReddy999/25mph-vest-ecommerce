window.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const welcomeElement = document.getElementById('welcomeUser');
    const loginNavItem = document.getElementById('loginNavItem');
    const userDropdown = document.getElementById('userDropdown');
  
    if (user && user.fullName) {
      const firstName = user.fullName.split(' ')[0];
      welcomeElement.textContent = `👤 Welcome ${firstName}`;
      userDropdown.style.display = 'inline-block';
      if (loginNavItem) loginNavItem.style.display = 'none';
    } else {
      if (userDropdown) userDropdown.style.display = 'none';
      if (loginNavItem) loginNavItem.style.display = 'inline-block';
    }
  
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
      });
    }
  });
  