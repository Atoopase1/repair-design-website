
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Load projects
  fetch('/api/projects')
    .then(r => r.json())
    .then(data => {
      const wrap = document.getElementById('projects');
      if (!wrap) return;
      wrap.classList.add('grid','cols-3');
      (data.projects || []).forEach(p => {
        const card = document.createElement('div');
        card.className = 'card item';
        card.innerHTML = `
          <img class="thumb" src="${p.thumbnail || 'assets/img/gallery_5.png'}" alt="thumbnail"/>
          <div>
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              <strong>${p.title}</strong>
              <span class="badge">${p.category || 'Website'}</span>
            </div>
            <p class="muted">${p.summary || ''}</p>
            ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">View project →</a>` : ''}
          </div>`;
        wrap.appendChild(card);
      });
    })
    .catch(() => {});

  // Contact form
  const cform = document.getElementById('contact-form');
  const cstatus = document.getElementById('contact-status');
  if (cform) {
    cform.addEventListener('submit', async (e) => {
      e.preventDefault();
      cstatus.textContent = 'Sending...';
      const formData = new FormData(cform);
      const payload = Object.fromEntries(formData.entries());
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      cstatus.textContent = data.message || 'Sent!';
      cform.reset();
    });
  }

  // Subscribe form
  const sform = document.getElementById('subscribe-form');
  const sstatus = document.getElementById('subscribe-status');
  if (sform) {
    sform.addEventListener('submit', async (e) => {
      e.preventDefault();
      sstatus.textContent = 'Subscribing...';
      const formData = new FormData(sform);
      const payload = Object.fromEntries(formData.entries());
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      sstatus.textContent = data.message || 'Subscribed!';
      sform.reset();
    });
  }
});
