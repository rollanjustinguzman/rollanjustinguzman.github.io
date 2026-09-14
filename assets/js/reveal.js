// reveal.js — one scroll reveal, applied to section headings only.
// Paste before </body>, or save as assets/js/reveal.js and link it.

(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Pick what reveals. Section h2s and the case-study figures are enough.
  var targets = document.querySelectorAll('section > h2, section > p:first-of-type');

  targets.forEach(function (el) {
    el.setAttribute('data-reveal', '');
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target); // reveal once, never re-hide
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) {
    io.observe(el);
  });
})();
