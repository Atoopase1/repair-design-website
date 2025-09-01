// Highlight nav
(function highlightNav() {
  const page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
  document.querySelectorAll('header.nav a').forEach(a => {
    const match = a.getAttribute('data-page');
    if ((page === 'index' && match === 'home') || match === page) a.classList.add('active');
  });
})();

// Footer year
(function setYear() {
  const s = document.getElementById('year');
  if (s) s.textContent = new Date().getFullYear();
})();

// Toast
window.toast = function(message) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = message;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
};

// Improved API helper
window.api = async function(path, options = {}) {
  const base = window.API_BASE || '';
  const controller = new AbortController();
  const timeout = options.timeout || 5000; // 5 sec default
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(base + path, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options
    });

    clearTimeout(timer);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }

    // Return JSON unless no content
    return res.status === 204 ? null : res.json();
  } catch (err) {
    clearTimeout(timer);
    console.error('API error:', err.message);
    throw err;
  }
};
