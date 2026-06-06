const https = require('https');
const http = require('http');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  let url = event.queryStringParameters && event.queryStringParameters.url;
  if (!url) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing url parameter' }) };
  }

  if (!url.startsWith('http')) url = 'https://' + url;

  try {
    const html = await fetchPage(url, 8000);
    const h = html.toLowerCase();
    const result = {};

    // Privacy compliance checks
    if (h.includes('מדיניות פרטיות') || h.includes('privacy policy') || h.includes('privacy-policy')) result.policy = true;
    if (h.includes('עוגיות') || h.includes('cookies') || h.includes('cookie-consent') || h.includes('cookie_consent') || h.includes('cookieconsent')) result.cookies = true;
    if (h.includes('הפרטים נאספים') || h.includes('מסכים/ה לשמירת') || h.includes('בהתאם למדיניות') || h.includes('הפרטים לצורך')) result.notice = true;
    if (h.includes('אני מסכים') || h.includes('אני מאשר')) result.consent = true;
    if (h.includes('נגישות') || h.includes('accessibility')) result._a11y = true;
    if (h.includes('הסרה') || h.includes('unsubscribe') || h.includes('opt-out')) result.optout = true;

    // Vendors & trackers
    result._vendors = [];
    if (h.includes('gtag(') || h.includes('googletagmanager') || h.includes('google-analytics')) { result._ga = true; result._vendors.push('analytics'); }
    if (h.includes('fbq(') || h.includes('facebook.com/tr') || h.includes('fbevents')) { result._pixel = true; result._vendors.push('pixel'); }
    if (h.includes('outbrain')) result._vendors.push('outbrain');
    if (h.includes('taboola')) result._vendors.push('taboola');
    if (h.includes('tiktok')) result._vendors.push('tiktok');
    if (h.includes('linkedin.com/px') || h.includes('snap.licdn') || h.includes('linkedin-insight')) result._vendors.push('linkedin');
    if (h.includes('hotjar')) result._vendors.push('hotjar');
    if (h.includes('mailchimp') || h.includes('ravmesser') || h.includes('sendinblue')) result._vendors.push('mail_vendor');
    if (h.includes('intercom') || h.includes('drift') || h.includes('zendesk') || h.includes('crisp') || h.includes('tawk')) result._vendors.push('chat');

    // Data signals
    result._signals = [];
    if (h.includes('<form')) result._signals.push('forms');
    if (h.includes('type="email"') || h.includes("type='email'")) result._signals.push('email');
    if (h.includes('type="tel"') || h.includes("type='tel'")) result._signals.push('phone');
    if (h.includes('login') || h.includes('התחברות') || h.includes('הרשמה') || h.includes('signup') || h.includes('sign-up')) result._signals.push('accounts');
    if (h.includes('credit') || h.includes('אשראי') || h.includes('סליקה') || h.includes('checkout')) result._signals.push('payment');

    // Detect monitoring/profiling
    result._monitoring = result._vendors.length >= 3 || h.includes('hotjar');
    result._profiling = result._vendors.includes('pixel') || result._vendors.includes('tiktok') || result._vendors.includes('linkedin');

    result.ok = true;
    result.scanned = url;
    result.htmlLength = html.length;

    return { statusCode: 200, headers, body: JSON.stringify(result) };
  } catch (err) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};

function fetchPage(url, timeout) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PrivacyScanner/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'he,en;q=0.5'
      },
      timeout: timeout
    }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (loc.startsWith('/')) {
          const u = new URL(url);
          loc = u.protocol + '//' + u.host + loc;
        }
        fetchPage(loc, timeout).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error('Status ' + res.statusCode));
        return;
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; if (data.length > 500000) res.destroy(); });
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}
