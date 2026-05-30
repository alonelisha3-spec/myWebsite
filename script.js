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

const FORMSPREE = 'https://formspree.io/f/mgopabze';

// === HERO FORM ===
document.querySelector('.hero-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  try {
    const res = await fetch(FORMSPREE, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) });
    if (res.ok) { form.reset(); alert('תודה! נחזור אליך בהקדם.'); }
    else { alert('שגיאה בשליחה, נסה שוב.'); }
  } catch { alert('שגיאה בשליחה, נסה שוב.'); }
});

// === CONTACT FORM ===
document.querySelector('.contact-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  try {
    const res = await fetch(FORMSPREE, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) });
    if (res.ok) { form.reset(); alert('הודעתך התקבלה! נחזור אליך בהקדם.'); }
    else { alert('שגיאה בשליחה, נסה שוב.'); }
  } catch { alert('שגיאה בשליחה, נסה שוב.'); }
});
