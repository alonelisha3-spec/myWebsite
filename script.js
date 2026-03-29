// Accessibility panel toggle
function toggleAccessibility() {
  document.getElementById('accessibilityPanel').classList.toggle('open');
}

let fontSize = 100;
function changeFontSize(dir) {
  fontSize = Math.min(130, Math.max(80, fontSize + dir * 10));
  document.body.style.fontSize = fontSize + '%';
}

function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
}

function resetAccessibility() {
  fontSize = 100;
  document.body.style.fontSize = '';
  document.body.classList.remove('high-contrast');
}

// Close panel when clicking outside
document.addEventListener('click', e => {
  const panel = document.getElementById('accessibilityPanel');
  if (!panel.contains(e.target) && !e.target.closest('.fab.accessibility')) {
    panel.classList.remove('open');
  }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Hero form
document.querySelector('.hero-form').addEventListener('submit', e => {
  e.preventDefault();
  alert('Thank you! We will be in touch soon.');
  e.target.reset();
});

// Contact form
document.querySelector('.contact-form').addEventListener('submit', e => {
  e.preventDefault();
  alert('Message sent! We will be in touch soon.');
  e.target.reset();
});
