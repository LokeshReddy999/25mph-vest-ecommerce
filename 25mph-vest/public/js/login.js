const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

function showLogin() {
  registerForm.classList.remove('show');
  loginForm.classList.add('show');
}

function showRegister() {
  loginForm.classList.remove('show');
  registerForm.classList.add('show');
}

// 🌀 Slideshow animation
const slides = document.querySelectorAll("#slideshow .slide");
let index = 0;
setInterval(() => {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}, 3000);

// Handle login
document.querySelector('#loginForm form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target[0].value;
  const password = e.target[1].value;

  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Login failed');
      return;
    }

    // Save user data in localStorage
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('userEmail', data.user.email);
    localStorage.setItem('userName', data.user.fullName); // Optional, if you use it



    // Redirect based on role
    if (data.user.isAdmin) {
      window.location.href = '/admin-dashboard.html';
    } else {
      window.location.href = '/';
    }

  } catch (err) {
    console.error('Login Error:', err);
    alert('Something went wrong!');
  }
});

// 📝 Handle registration
document.querySelector('#registerForm form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fullName = e.target[0].value;
  const email = e.target[1].value;
  const password = e.target[2].value;

  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Registration failed');
      return;
    }

    alert('Registration successful! Please log in.');
    showLogin();
  } catch (err) {
    console.error('Register Error:', err);
    alert('Something went wrong!');
  }
});

//  Show welcome name if logged in
window.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const welcomeEl = document.getElementById('welcomeUser');

  if (user && user.fullName && welcomeEl) {
    const firstName = user.fullName.split(' ')[0];
    welcomeEl.textContent = `👋 Welcome ${firstName}`;
    welcomeEl.style.display = 'inline-block';

    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) userDropdown.style.display = 'inline-block';

    const loginNav = document.getElementById('loginNavItem');
    if (loginNav) loginNav.style.display = 'none';
  }
});

// Handle logout
document.addEventListener('click', (e) => {
  if (e.target.id === 'logoutBtn') {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
});
