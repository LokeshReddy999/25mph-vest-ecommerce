document.addEventListener('DOMContentLoaded', () => {
    const profileContainer = document.getElementById('profile-icon-container');
    const profileName = document.getElementById('profile-name');
    const dropdownMenu = document.getElementById('dropdown-menu');
  
    const fullName = localStorage.getItem('userName') || "John Doe";
    const profileImage = localStorage.getItem('profileImage');
    const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  
    // Render icon
    if (profileImage) {
      profileContainer.innerHTML = `<img src="${profileImage}" alt="Profile" id="profile-icon" />`;
    } else {
      profileContainer.innerText = initials;
    }
  
    profileName.innerText = fullName;
  
    // Toggle dropdown class
    profileContainer.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });
  
    window.addEventListener('click', function(e) {
      if (!document.querySelector('.profile-menu').contains(e.target)) {
        dropdownMenu.classList.remove('show');
      }
    });
  });
  
  function handleLogout() {
    localStorage.clear();
    alert("Logged out!");
    window.location.href = "/login.html";
  }
  