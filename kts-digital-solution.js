(() => {
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav-links');
  const closeMenu = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); };
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.querySelectorAll('[data-solution]').forEach(link => link.addEventListener('click', () => { document.getElementById('solution').value = link.dataset.solution; }));
  document.getElementById('solution-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const data = new FormData(event.currentTarget);
    const message = `Hello KTS Digital Solution, I would like to discuss a project.\n\nName: ${data.get('name')}\nBusiness: ${data.get('business')}\nPhone: ${data.get('phone')}\nSolution: ${data.get('solution')}\nGoal: ${data.get('goal')}`;
    const url = `https://wa.me/917983910795?text=${encodeURIComponent(message)}`;
    const status = document.getElementById('form-status');
    status.hidden = false;
    status.textContent = 'Review your enquiry in WhatsApp and send it to start the conversation. ';
    const fallback = document.createElement('a');
    fallback.href = url; fallback.target = '_blank'; fallback.rel = 'noopener noreferrer'; fallback.textContent = 'Open WhatsApp';
    status.appendChild(fallback);
    window.open(url, '_blank', 'noopener,noreferrer');
  });
  document.getElementById('year').textContent = new Date().getFullYear();
})();
