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

  const currentPage = (
    document.body.dataset.page ||
    location.pathname.split('/').pop() ||
    'index'
  ).replace('.html', '');

  mounts.forEach((mount) => {
    mount.innerHTML = markup;

    /* Mark current page link */
    mount.querySelectorAll('[data-page-link]').forEach((link) => {
      if (link.dataset.pageLink !== currentPage) return;
      link.classList.add('is-current');
      link.setAttribute('aria-current', 'page');
      if (link.matches('a')) {
        link.removeAttribute('href');
        link.setAttribute('tabindex', '-1');
      }
    });

    /* To Create dropdown */
    const create = mount.querySelector('[data-site-nav-create]');
    if (!create) return;
    const btn = create.querySelector('.site-nav-create-btn');

    const openMenu  = () => { create.classList.add('open');    btn.setAttribute('aria-expanded', 'true');  };
    const closeMenu = () => { create.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    const toggle    = () => create.classList.contains('open') ? closeMenu() : openMenu();

    btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); toggle(); });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); e.stopPropagation(); toggle(); }, { passive: false });

    document.addEventListener('click',      (e) => { if (!create.contains(e.target)) closeMenu(); });
    document.addEventListener('touchstart', (e) => { if (!create.contains(e.target)) closeMenu(); }, { passive: true });
  });
})();
