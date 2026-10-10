(() => {
  const nav = document.querySelector('.navlinks');
  const menuButton = document.querySelector('.menu-btn');
  const filters = [...document.querySelectorAll('.job-filter')];
  const jobs = [...document.querySelectorAll('.job')];
  const count = document.querySelector('#jobCount');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.category;
    filters.forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    let visible = 0;
    jobs.forEach(job => { const show = category === 'all' || job.dataset.category === category; job.hidden = !show; if (show) visible += 1; });
    count.textContent = `${visible} talent categor${visible === 1 ? 'y' : 'ies'}`;
  }));

  document.addEventListener('click', event => {
    if (innerWidth > 960 || !nav.classList.contains('open')) return;
    if (!nav.contains(event.target) && event.target !== menuButton) menuButton.click();
  });

  const sectionLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const observed = sectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      const active = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (!active) return;
      sectionLinks.forEach(link => link.toggleAttribute('aria-current', link.getAttribute('href') === `#${active.target.id}`));
    }, { rootMargin:'-30% 0px -60%', threshold:[0,.2,.6] });
    observed.forEach(section => sectionObserver.observe(section));
  }

  const topButton = document.createElement('button');
  topButton.className = 'back-to-top'; topButton.type = 'button'; topButton.innerHTML = '↑'; topButton.setAttribute('aria-label','Back to top');
  document.body.appendChild(topButton);
  addEventListener('scroll', () => topButton.classList.toggle('show', scrollY > 650), { passive:true });
  topButton.addEventListener('click', () => scrollTo({ top:0, behavior:reducedMotion?'auto':'smooth' }));

  if (!reducedMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('reveal-ready');
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){entry.target.classList.add('revealed');revealObserver.unobserve(entry.target)}}),{threshold:.12});
    document.querySelectorAll('.service-card,.job,.step,.trust-item').forEach(item => { item.classList.add('reveal-item'); revealObserver.observe(item); });
  }

  const form = document.querySelector('#hiring-form');
  const errorBox = document.createElement('div');
  errorBox.className = 'form-error'; errorBox.id = 'formError'; errorBox.setAttribute('role','alert');
  form.appendChild(errorBox);
  form.addEventListener('input', () => { errorBox.classList.remove('show'); errorBox.textContent=''; });
  form.addEventListener('invalid', event => { event.preventDefault(); errorBox.textContent='Please complete the highlighted required field correctly.'; errorBox.classList.add('show'); event.target.focus(); }, true);

  document.querySelectorAll('.faq-list details').forEach(detail => detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.faq-list details[open]').forEach(other => { if(other !== detail) other.open=false; });
  }));
})();
