(async function initSiteNav() {
  const mounts = Array.from(document.querySelectorAll('.site-nav-mount'));
  if (!mounts.length) return;

  let markup = '';
  try {
    const res = await fetch('components/site-nav.html', { cache: 'no-cache' });
    markup = await res.text();
  } catch (err) {
    console.warn('Site nav component failed to load.', err);
    return;
  }

  const currentPage = (document.body.dataset.page || location.pathname.split('/').pop() || 'index.html').replace('.html', '');

  mounts.forEach((mount) => {
    mount.innerHTML = markup;

    mount.querySelectorAll('[data-page-link]').forEach((link) => {
      if (link.dataset.pageLink !== currentPage) return;
      link.classList.add('is-current');
      link.setAttribute('aria-current', 'page');
      if (link.matches('a')) {
        link.removeAttribute('href');
        link.setAttribute('tabindex', '-1');
      }
    });

    const create = mount.querySelector('[data-site-nav-create]');
    if (!create) return;

    const btn = create.querySelector('.site-nav-create-btn');
    btn.addEventListener('click', () => {
      const isOpen = create.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (event) => {
      if (create.contains(event.target)) return;
      create.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();
