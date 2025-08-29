(function highlightNav() {
  const page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
  document.querySelectorAll('header.nav a').forEach(a => {
    const match = a.getAttribute('data-page');
    if ((page === 'index' && match === 'home') || match === page) a.classList.add('active');
  });
})();

(function setYear() {
  const s = document.getElementById('year');
  if (s) s.textContent = new Date().getFullYear();
})();

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

window.api = function(path, options = {}) {
  const base = window.API_BASE || 'http://localhost:4000';
  return fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  }).then(async r => {
    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      throw new Error(d.error || 'Request failed');
    }
    return r.status === 204 ? null : r.json();
  });
};
