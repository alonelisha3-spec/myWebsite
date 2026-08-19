// === GA4 CUSTOM EVENTS ===
function trackEvent(eventName, params) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
}

// Track all CTA clicks
document.addEventListener('click', function(e) {
  var link = e.target.closest('a, button');
  if (!link) return;

  var href = link.getAttribute('href') || '';
  var text = link.textContent.trim().substring(0, 50);

  if (link.classList.contains('btn-gold') || link.classList.contains('cta-primary') || link.classList.contains('cta-secondary') || link.classList.contains('product-cta') || link.classList.contains('wills-cta')) {
    trackEvent('cta_click', { cta_text: text, cta_url: href, page: window.location.pathname });
  }

  if (href.startsWith('tel:')) {
    trackEvent('phone_click', { phone: href, page: window.location.pathname });
  }

  if (href.includes('wa.me')) {
    trackEvent('whatsapp_click', { page: window.location.pathname });
  }

  if (href.includes('hebrew-will-guide') || href.includes('elisha-law.lovable')) {
    trackEvent('tool_launch', { tool_url: href, page: window.location.pathname });
  }
});

// === SCROLL DEPTH TRACKING ===
var scrollMilestones = { 25: false, 50: false, 75: false, 100: false };

window.addEventListener('scroll', function() {
  var scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
  [25, 50, 75, 100].forEach(function(milestone) {
    if (scrollPercent >= milestone && !scrollMilestones[milestone]) {
      scrollMilestones[milestone] = true;
      trackEvent('scroll_depth', { percent: milestone, page: window.location.pathname });
    }
  });
});

// === SCROLL-TRIGGERED CTA BAR ===
(function() {
  var scrollCta = document.getElementById('scrollCta');
  if (!scrollCta) return;

  var shown = false;
  var lastY = 0;

  window.addEventListener('scroll', function() {
    var y = window.scrollY;
    var threshold = document.body.scrollHeight * 0.35;

    if (y > threshold && !shown) {
      scrollCta.classList.add('visible');
      shown = true;
    }

    // Hide on fast scroll down, show on scroll up (mobile UX)
    if (window.innerWidth < 768) {
      if (y > lastY + 20) scrollCta.classList.add('hidden');
      else if (y < lastY - 10) scrollCta.classList.remove('hidden');
    }
    lastY = y;
  });
})();

// === EXIT INTENT POPUP ===
(function() {
  var exitPopup = document.getElementById('exitPopup');
  if (!exitPopup) return;

  var shown = false;

  // Desktop: mouse leaves viewport
  document.addEventListener('mouseleave', function(e) {
    if (e.clientY < 10 && !shown) {
      shown = true;
      exitPopup.classList.add('visible');
      trackEvent('exit_intent_shown', { page: window.location.pathname });
    }
  });

  // Close popup
  exitPopup.addEventListener('click', function(e) {
    if (e.target.classList.contains('exit-overlay') || e.target.classList.contains('exit-close')) {
      exitPopup.classList.remove('visible');
    }
  });
})();

// === UTM CAPTURE ===
(function() {
  var params = new URLSearchParams(window.location.search);
  var utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  utmFields.forEach(function(field) {
    var val = params.get(field);
    if (val) {
      sessionStorage.setItem(field, val);
    }
  });

  // Inject UTM into all forms as hidden fields
  document.querySelectorAll('form').forEach(function(form) {
    utmFields.forEach(function(field) {
      var val = sessionStorage.getItem(field);
      if (val && !form.querySelector('[name="' + field + '"]')) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = field;
        input.value = val;
        form.appendChild(input);
      }
    });
  });
})();

// === FORM TRACKING ===
document.querySelectorAll('form').forEach(function(form) {
  form.addEventListener('submit', function() {
    var formName = form.getAttribute('name') || 'unknown';
    trackEvent('form_submit', { form_name: formName, page: window.location.pathname });
  });
});
