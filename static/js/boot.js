/* Boot. Resolves the language before the first paint and marks the document
   as script-enabled, so reveal animations opt in rather than hiding content
   when JS fails. */
(function () {
  var d = document.documentElement, lg;
  try { lg = localStorage.getItem('ht.lang'); } catch (e) {}
  if (lg !== 'en' && lg !== 'ja') {
    lg = /^ja\b/i.test(navigator.language || '') ? 'ja' : 'en';
  }
  d.setAttribute('data-lang', lg);
  d.setAttribute('lang', lg);
  d.classList.add('js');
})();
