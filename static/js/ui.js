/* ====================================================================
   LANGUAGE toggle
   ==================================================================== */
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('langBtn');
  function sync() {
    // The button's two labels live in markup and swap via CSS.
    const ja = root.getAttribute('data-lang') === 'ja';
    root.setAttribute('lang', ja ? 'ja' : 'en');
    // alt is an attribute, so it cannot hold both languages at once.
    for (const im of document.querySelectorAll('img[data-alt-ja]')) {
      im.alt = ja ? im.dataset.altJa : im.dataset.altEn;
    }
  }
  sync();
  btn.addEventListener('click', () => {
    const ja = root.getAttribute('data-lang') === 'ja';
    const next = ja ? 'en' : 'ja';
    root.setAttribute('data-lang', next);
    try { localStorage.setItem('ht.lang', next); } catch (e) {}
    sync();
  });
})();

/* ====================================================================
   Header height -> --header-h, for scroll-margin on anchor targets.
   Measured rather than hardcoded because the header wraps at narrow widths.
   ==================================================================== */
(function () {
  const header = document.querySelector('header');
  if (!header) return;
  const apply = () => document.documentElement.style.setProperty(
    '--header-h', Math.round(header.getBoundingClientRect().height) + 'px');
  apply();
  if (window.ResizeObserver) new ResizeObserver(apply).observe(header);
  else window.addEventListener('resize', apply);
})();

/* ====================================================================
   Scroll reveal
   ==================================================================== */
(function () {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
