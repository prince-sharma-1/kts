(() => {
  const KEY = 'ktsVentureTheme';
  const root = document.documentElement;
  const pageName = decodeURIComponent(location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const pages = {
    'index.html': 'academy', 'aspire_ts.html': 'academy',
    'kts education center.html': 'education', 'kts_it_home.html': 'it',
    'kts group.html': 'enterprise', 'score high.html': 'score',
    'kts-digital-solution.html': 'digital', 'kts-digital-solution-clients.html': 'digital'
  };
  root.dataset.venturePage = pages[pageName] || 'default';
  const nativeDark = Boolean(document.querySelector('link[href*="academy-home.css"]'));
  root.dataset.nativeTheme = nativeDark ? 'dark' : 'light';
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch {}

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'venture-theme-toggle';
  document.body.appendChild(button);

  function apply(theme) {
    const dark = theme === 'dark';
    root.dataset.ventureTheme = dark ? 'dark' : 'light';
    button.innerHTML = `<span aria-hidden="true">${dark ? '☀' : '☾'}</span><b>${dark ? 'Light' : 'Dark'}</b>`;
    button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    button.setAttribute('aria-pressed', String(dark));
    button.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b1423' : '#f7f9fc');
    try { localStorage.setItem(KEY, dark ? 'dark' : 'light'); } catch {}
  }

  apply(saved === 'dark' || saved === 'light' ? saved : (nativeDark ? 'dark' : 'light'));
  button.addEventListener('click', () => apply(root.dataset.ventureTheme === 'dark' ? 'light' : 'dark'));
})();
