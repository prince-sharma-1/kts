(() => {
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav-links');
  const closeMenu = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); };
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.querySelectorAll('[data-solution]').forEach(link => link.addEventListener('click', () => { document.getElementById('solution').value = link.dataset.solution; }));
  document.getElementById('year').textContent = new Date().getFullYear();
})();
