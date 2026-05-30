// === HAMBURGER MENU ===
function toggleMenu() {
  var nav = document.getElementById('mainNav');
  var btn = document.getElementById('hamburger');
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

var fontSize = 100;
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

document.addEventListener('click', function(e) {
  var panel = document.getElementById('accessibilityPanel');
  if (panel && !panel.contains(e.target) && !e.target.closest('.fab.accessibility')) {
    panel.classList.remove('open');
  }
});

// === ACTIVE NAV ON SCROLL ===
var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', function() {
  var current = '';
  sections.forEach(function(section) {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(function(link) {
    link.classList.remove('active');
    var href = link.getAttribute('href');
    if (href === '#' + current) {
      link.classList.add('active');
    }
  });
});

// === FORM SUBMISSION (Formspree) ===
var FORMSPREE = 'https://formspree.io/f/mgopabze';

document.querySelectorAll('form').forEach(function(form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var originalText = btn.textContent;
    btn.textContent = 'שולח...';
    btn.disabled = true;

    fetch(FORMSPREE, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    }).then(function(res) {
      if (res.ok) {
        form.reset();
        btn.textContent = 'נשלח בהצלחה!';
        btn.style.background = '#28a745';
        setTimeout(function() {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      } else {
        btn.textContent = originalText;
        btn.disabled = false;
        alert('שגיאה בשליחה, נסו שוב.');
      }
    }).catch(function() {
      btn.textContent = originalText;
      btn.disabled = false;
      alert('שגיאה בשליחה, נסו שוב.');
    });
  });
});

// === FAQ ACCORDION (for landing pages) ===
document.querySelectorAll('.faq-question').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var item = btn.closest('.faq-item');
    var wasOpen = item.classList.contains('open');

    // Close all siblings
    item.parentElement.querySelectorAll('.faq-item').forEach(function(el) {
      el.classList.remove('open');
    });

    // Toggle current
    if (!wasOpen) item.classList.add('open');
  });
});
