// === HAMBURGER MENU ===
function toggleMenu() {
  const nav = document.getElementById('mainNav');
  const btn = document.getElementById('hamburger');
  nav.classList.toggle('open');
  btn.classList.toggle('open');
}

function closeMenu() {
  document.getElementById('mainNav').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

// === ACCESSIBILITY ===
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

document.addEventListener('click', e => {
  const panel = document.getElementById('accessibilityPanel');
  if (!panel.contains(e.target) && !e.target.closest('.fab.accessibility')) {
    panel.classList.remove('open');
  }
});

// === WILLS IFRAME BACK ===
function willsBack() {
  const iframe = document.getElementById('willsIframe');
  try {
    iframe.contentWindow.history.back();
  } catch (e) {
    // cross-origin fallback — reload
    iframe.src = iframe.src;
  }
}

// === ACTIVE NAV ON SCROLL ===
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

// === HERO FORM — שולח מייל ===
document.querySelector('.hero-form').addEventListener('submit', e => {
  e.preventDefault();
  const firstName = e.target[0].value;
  const lastName  = e.target[1].value;
  const email     = e.target[2].value;
  const phone     = e.target[3].value;
  const subject   = encodeURIComponent('ליד חדש מהאתר – ' + firstName + ' ' + lastName);
  const body      = encodeURIComponent('שם: ' + firstName + ' ' + lastName + '\nדוא"ל: ' + email + '\nנייד: ' + phone);
  window.location.href = 'mailto:alonelisha3@gmail.com?subject=' + subject + '&body=' + body;
  e.target.reset();
});

// === CONTACT FORM — שולח מייל ===
document.querySelector('.contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const firstName = e.target[0].value;
  const lastName  = e.target[1].value;
  const email     = e.target[2].value;
  const message   = e.target[3].value;
  const subject   = encodeURIComponent('פנייה חדשה מהאתר – ' + firstName + ' ' + lastName);
  const body      = encodeURIComponent('שם: ' + firstName + ' ' + lastName + '\nדוא"ל: ' + email + '\n\nהודעה:\n' + message);
  window.location.href = 'mailto:alonelisha3@gmail.com?subject=' + subject + '&body=' + body;
  e.target.reset();
});
