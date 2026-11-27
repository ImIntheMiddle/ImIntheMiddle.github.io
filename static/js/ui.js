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
    // A text alternative is an attribute, so it cannot hold both languages at once.
    for (const im of document.querySelectorAll('[data-alt-ja]')) {
      const text = ja ? im.dataset.altJa : im.dataset.altEn;
      if (im.tagName === 'IMG') im.alt = text; else im.setAttribute('aria-label', text);
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

/* ====================================================================
   Lists that open with their leading entries
   ==================================================================== */
(function () {
  for (const btn of document.querySelectorAll('.more-btn')) {
    btn.addEventListener('click', () => {
      const box = btn.closest('.foldable');
      const open = box.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      // Closing a long list leaves the reader below it; bring its tile back.
      if (!open) btn.closest('.tile').scrollIntoView({ block: 'nearest' });
    });
  }
})();

/* ====================================================================
   Table of contents: shown past the hero, marking the section being read
   ==================================================================== */
(function () {
  const toc = document.getElementById('toc');
  const hero = document.querySelector('.hero-block');
  if (!toc || !hero) return;
  const root = document.documentElement;
  new IntersectionObserver((e) => root.classList.toggle('past-hero', !e[0].isIntersecting),
                           { rootMargin: '-45% 0px 0px 0px' }).observe(hero);
  const links = [...toc.querySelectorAll('a')];
  const targets = links.map((a) => document.getElementById(a.getAttribute('href').slice(1)));
  let queued = false;
  const mark = () => {
    queued = false;
    const line = window.innerHeight * 0.35;
    let here = -1;
    targets.forEach((el, i) => { if (el && el.getBoundingClientRect().top <= line) here = i; });
    links.forEach((a, i) => a.classList.toggle('here', i === here));
  };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(mark); } },
                          { passive: true });
  mark();
})();
