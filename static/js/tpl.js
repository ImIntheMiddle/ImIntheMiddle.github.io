/* ====================================================================
   @@TEMPLATES@@ — turns DATA into the markup the stylesheet expects.
   Author text is escaped on the way in, so a stray "<" in a paper title
   cannot break the page. Only h(), rich() and ref() ever produce markup,
   and innerHTML is written in exactly one place: mount().
   ==================================================================== */
const RAW = Symbol('raw');
const raw = (s) => ({ [RAW]: s });
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

function fmt(v) {
  if (v == null || v === false || v === true) return '';
  if (Array.isArray(v)) return v.map(fmt).join('');
  if (typeof v === 'object' && RAW in v) return v[RAW];
  return esc(v);
}
function h(strings, ...vals) {
  let out = strings[0];
  for (let i = 0; i < vals.length; i++) out += fmt(vals[i]) + strings[i + 1];
  return raw(out);
}
const isExternal = (href) => /^(https?:)?\/\//.test(href);
const pickLang = (f, lang) => (f && typeof f === 'object' && !(RAW in f))
  ? (lang === 'ja' && f.ja != null ? f.ja : f.en) : f;

/* A ref is a link, or a plain styled span when it has no href. */
const newTabAttr = (href, newTab) => (newTab == null ? isExternal(href) : newTab)
  ? raw(' target="_blank" rel="noopener"') : raw('');

function ref(r, lang) {
  const label = pickLang(r.label, lang);
  if (r.href) return h`<a href="${r.href}"${newTabAttr(r.href, r.newTab)}>${label}</a>`;
  return r.cls ? h`<span class="${r.cls}">${label}</span>` : h`${label}`;
}

/* Emphasis is per-language (EN and JA stress different words) so it stays in
   the string; links are not, so they are referenced by token instead. */
function rich(str, refs, lang) {
  return raw(esc(str)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\{(\w+)\}/g, (m, k) => {
      const r = refs && refs[k];
      if (!r) { console.warn('[tpl] unknown ref', k, 'in', str); return m; }
      return fmt(ref(r, lang));
    }));
}

/* Both languages are emitted; the stylesheet hides the inactive one. That
   keeps the toggle instant and leaves both in the DOM for crawlers. */
function t(field, refs) {
  if (field == null) return raw('');
  if (typeof field === 'object' && RAW in field) return field;
  if (typeof field !== 'object') return rich(String(field), refs, 'en');
  return h`<span class="en" lang="en">${rich(field.en, refs, 'en')}</span><span class="ja" lang="ja">${rich(field.ja == null ? field.en : field.ja, refs, 'ja')}</span>`;
}

function mount(sel, tpl) {
  const el = document.querySelector(sel);
  if (!el) { console.warn('[tpl] missing mount point', sel); return; }
  el.innerHTML = fmt(tpl);
}

/* ---------- section templates ---------- */
const newsItem = (n) => h`<li><span class="d">${n.date}</span><span class="t${n.cls ? ' ' + n.cls : ''}">${n.tag ? h`<span class="tag">${n.tag}</span>` : ''}${t(n.text, n.refs)}</span></li>`;

const pubAuthors = (p, me) => p.authors.map((a, i) =>
  h`${i ? ', ' : ''}${a === me ? h`<span class="me">${a}</span>` : a}`);

/* `showDate` puts the year and month before the rate, as the domestic
   talks have it. */
const pub = (p, me, showDate) => h`
      <div class="pub reveal${p.image ? '' : ' no-media'}">${p.image ? h`<div class="thumb">${media(p.image)}</div>` : ''}<div class="pub-body">
        <span class="venue">${t(p.venue)}${showDate || p.rate ? h`<span class="rate"><span class="sep"> · </span>${showDate ? p.date : ''}${showDate && p.rate ? ' · ' : ''}${p.rate ? t(p.rate) : ''}</span>` : ''}</span>
        <h3>${p.project ? h`<a href="${p.project}"${newTabAttr(p.project)}>${p.title}</a>` : p.title}${p.titleNote ? h` <span class="verify">${p.titleNote}</span>` : ''}</h3>
        <div class="auth">${pubAuthors(p, me)}</div>
        ${p.links.length ? h`<div class="pub-links">${p.links.map((l) => ref(l, 'en'))}</div>` : ''}
        ${p.note ? h`<p class="pub-note">${p.note}</p>` : ''}
      </div></div>`;

/* An image is always optional. Where one is absent the layout closes up
   rather than showing an empty frame, so rows and cards with and without
   artwork sit together without looking unfinished.

     image: { src: 'static/img/pub/emloco.webp',
              src2x: 'static/img/pub/emloco@2x.webp',   // optional
              w: 1200, h: 750,                          // optional, stops reflow
              alt: { en: 'EmLoco teaser', ja: 'EmLoco の概要図' } }  */
const media = (im) => !im ? '' : im.video ? h`<video src="${im.video}" poster="${im.src}" aria-label="${pickLang(im.alt, 'en')}"${
  im.w ? h` width="${im.w}" height="${im.h}"` : ''} autoplay muted loop playsinline preload="metadata"></video>` : h`<img src="${im.src}"${im.src2x
  ? h` srcset="${im.src} 1x, ${im.src2x} 2x"` : ''} alt="${pickLang(im.alt, 'en')}"${
  im.alt && typeof im.alt === 'object' ? h` data-alt-en="${im.alt.en}" data-alt-ja="${im.alt.ja || im.alt.en}"` : ''}${
  im.w ? h` width="${im.w}" height="${im.h}"` : ''} loading="lazy" decoding="async">`;

/* The award title and its organisation line sit inside the same language
   span, so this pairs them per language rather than going through t(). */
const awardName = (a) => h`<span class="en" lang="en">${rich(pickLang(a.name, 'en'), a.refs, 'en')}${a.org ? h`<span class="org">${rich(pickLang(a.org, 'en'), a.refs, 'en')}</span>` : ''}</span><span class="ja" lang="ja">${rich(pickLang(a.name, 'ja'), a.refs, 'ja')}${a.org ? h`<span class="org">${rich(pickLang(a.org, 'ja'), a.refs, 'ja')}</span>` : ''}</span>`;

/* Awards, service and experience are all the same shape -- a period, a
   title and a subtitle -- so they share one renderer and one set of rules. */
const entryList = (items) => h`
      <div class="awards reveal">${items.map((a) => h`
        <div class="award">
          <span class="yr">${a.year}</span>
          <span class="name">${awardName(a)}</span>
        </div>`)}
      </div>`;

/* Newest first; Array.prototype.sort is stable, so entries of the same
   month keep their order in DATA. */
const newestFirst = (list) => list.slice().sort((a, b) => b.date.localeCompare(a.date));
const firstAuthored = (list, me) => list.filter((p) => p.authors[0] === me).length;

/* The counts above a list of papers or of talks. */
const TALLY = {
  papers: (n, k) => ({ en: `${n} papers · ${k} as first author`, ja: `国際論文 ${n}本（うち筆頭著者 ${k}本）` }),
  talks: (n, k) => ({ en: `${n} presentations in Japan · ${k} as first author`, ja: `国内発表 ${n}件（うち筆頭著者 ${k}件）` })
};
const tally = (kind, list, me) => h`
      <p class="tally reveal">${t(TALLY[kind](list.length, firstAuthored(list, me)))}</p>`;

/* A section's heading row: the title, an optional link at the right and,
   on the home page, the section's number. */
const secHead = (title, note, idx) => h`
      <div class="sec-head reveal">
        <h2>${t(title)}</h2>${note ? h`
        <span class="note"><a href="${note.href}"${newTabAttr(note.href)}>${t(note.label)}</a></span>` : ''}${idx == null ? '' : h`
        <span class="idx">${idx}</span>`}
      </div>`;
