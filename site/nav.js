(() => {
  const nav = document.querySelector('.primary-nav');
  if (!nav) return;
  const links = [
    ['Home', 'index.html#top', 'home'],
    ['Live Intelligence', 'index.html#signals', 'live'],
    ['Ask READY72', 'ask.html', 'ask'],
    ['Get Prepared', 'checkup.html', 'prepared'],
    ['Evidence & Insights', 'evidence.html', 'evidence'],
    ['Preparedness Kits', 'kit.html', 'kits'],
    ['About & Sources', 'about.html', 'about']
  ];
  const page = location.pathname.split('/').pop() || 'index.html';
  const hash = location.hash;
  const active = page === 'ask.html' ? 'ask' : page === 'checkup.html' ? 'prepared' : page === 'evidence.html' ? 'evidence' : page === 'kit.html' ? 'kits' : page === 'about.html' ? 'about' : hash === '#signals' ? 'live' : 'home';
  nav.replaceChildren(...links.map(([label, href, key]) => {
    const link = document.createElement('a');
    link.className = `nav-link${active === key ? ' active' : ''}`;
    link.href = href;
    link.textContent = label;
    if (active === key && page !== 'index.html') link.setAttribute('aria-current', 'page');
    return link;
  }));
  nav.addEventListener('click', event => {
    const link = event.target.closest('a.nav-link');
    if (!link || page !== 'index.html') return;
    const isLive = link.getAttribute('href').endsWith('#signals');
    nav.querySelectorAll('.nav-link').forEach(item => item.classList.toggle('active', item === link));
    if (isLive) history.replaceState(null, '', '#signals');
  });
})();
