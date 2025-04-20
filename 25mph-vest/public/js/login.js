const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Show/hide forms
function showLogin() {
  registerForm.classList.remove('show');
  loginForm.classList.add('show');
}

function showRegister() {
  loginForm.classList.remove('show');
  registerForm.classList.add('show');
}

// Slideshow text rotation
const slides = document.querySelectorAll("#slideshow .slide");
let index = 0;
setInterval(() => {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}, 3000);

// Handle Register
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

    if (res.ok) {
      alert('✅ Registration successful!');
      showLogin(); // Switch to login form
    } else {
      alert(`❌ ${data.message}`);
    }
  } catch (err) {
    alert('❌ Something went wrong while registering.');
  }
});

// Handle Login
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

    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('✅ Login successful!');
      window.location.href = '/homepage'; // 👈 redirect as needed
    } else {
      alert(`❌ ${data.message}`);
    }
  } catch (err) {
    alert('❌ Something went wrong while logging in.');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const welcomeElement = document.getElementById('welcomeUser');
  const dropdown = document.getElementById('userDropdown');

  if (user && user.fullName && welcomeElement && dropdown) {
    const firstName = user.fullName.split(' ')[0];
    welcomeElement.textContent = `Welcome ${firstName}`;
    dropdown.style.display = 'inline-block';
  }

  // Logout logic
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      window.location.href = '/login';
    });
  }
});
