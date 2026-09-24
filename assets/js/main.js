/* ============================================================
   Rollan Justin Guzman — portfolio interactions
   GSAP + ScrollTrigger + SplitText + Lenis, all bundled in
   assets/js/vendor so nothing depends on an outside CDN.

   If a visitor has "reduce motion" switched on in their system
   settings, the preloader, smooth scroll and text effects are
   skipped and the page simply shows everything.
   ============================================================ */

(function () {
  'use strict';

  var html = document.documentElement;
  var MOTION = html.classList.contains('motion');
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';

  // If the libraries failed to load for any reason, never leave the page stuck behind the loader.
  if (!hasGsap) {
    html.classList.remove('is-loading', 'motion');
    MOTION = false;
  } else {
    gsap.registerPlugin(ScrollTrigger, SplitText);
  }

  /* ---------- small helpers ---------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. Footer year + local clock ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var clockEl = $('#clock');
  function tick() {
    if (!clockEl) return;
    try {
      clockEl.textContent = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Manila', hour: 'numeric', minute: '2-digit'
      }).format(new Date());
    } catch (e) { clockEl.textContent = ''; }
  }
  tick();
  setInterval(tick, 20000);

  /* ---------- 2. Smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (MOTION && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.stop(); // held until the preloader finishes
  }

  function scrollToEl(target) {
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.6, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
    } else {
      target.scrollIntoView({ behavior: MOTION ? 'smooth' : 'auto' });
    }
  }

  /* ---------- 3. Mobile menu ---------- */
  var burger = $('#burger');
  var menu = $('#menu');
  var menuOpen = false;

  function setMenu(open) {
    menuOpen = open;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (!hasGsap) { menu.style.visibility = open ? 'visible' : 'hidden'; menu.style.clipPath = 'none'; return; }

    var links = $$('li a', menu);
    if (open) {
      if (lenis) lenis.stop();
      gsap.set(menu, { visibility: 'visible' });
      gsap.to(menu, { clipPath: 'inset(0 0 0% 0)', duration: MOTION ? 0.8 : 0, ease: 'expo.inOut' });
      gsap.fromTo(links, { yPercent: 105 }, { yPercent: 0, duration: MOTION ? 0.9 : 0, ease: 'expo.out', stagger: 0.06, delay: MOTION ? 0.3 : 0 });
    } else {
      gsap.to(menu, {
        clipPath: 'inset(0 0 100% 0)', duration: MOTION ? 0.7 : 0, ease: 'expo.inOut',
        onComplete: function () { gsap.set(menu, { visibility: 'hidden' }); }
      });
      if (lenis) lenis.start();
    }
  }
  if (burger && menu) burger.addEventListener('click', function () { setMenu(!menuOpen); });

  /* ---------- 4. In-page links ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var go = function () { scrollToEl(target); };
      if (menuOpen) { setMenu(false); setTimeout(go, MOTION ? 450 : 0); } else { go(); }
    });
  });

  /* ---------- 5. Lightbox ---------- */
  var lb = $('#lightbox');
  var lbImg = $('#lbImg');
  var lbCap = $('#lbCap');
  var figs = $$('.work figure').filter(function (f) { return !f.classList.contains('reel') && $('img', f); });
  var lbIndex = 0;
  var lastFocus = null;

  function showFig(i) {
    lbIndex = (i + figs.length) % figs.length;
    var f = figs[lbIndex];
    var img = $('img', f);
    var b = $('figcaption b', f);
    var s = $('figcaption span', f);
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = (b ? b.textContent : '') + (s ? ' — ' + s.textContent : '');
  }
  function openLb(i) {
    lastFocus = document.activeElement;
    showFig(i);
    lb.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop(); else document.body.style.overflow = 'hidden';
    if (hasGsap) {
      gsap.to(lb, { autoAlpha: 1, duration: MOTION ? 0.4 : 0 });
      gsap.fromTo(lbImg, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: MOTION ? 0.6 : 0, ease: 'expo.out' });
    } else { lb.style.visibility = 'visible'; lb.style.opacity = 1; }
    $('#lbClose').focus();
  }
  function closeLb() {
    lb.setAttribute('aria-hidden', 'true');
    if (hasGsap) gsap.to(lb, { autoAlpha: 0, duration: MOTION ? 0.35 : 0 });
    else { lb.style.visibility = 'hidden'; lb.style.opacity = 0; }
    if (lenis) lenis.start(); else document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  function stepLb(d) {
    if (!hasGsap || !MOTION) { showFig(lbIndex + d); return; }
    gsap.to(lbImg, {
      opacity: 0, x: -30 * d, duration: 0.2, onComplete: function () {
        showFig(lbIndex + d);
        gsap.fromTo(lbImg, { opacity: 0, x: 30 * d }, { opacity: 1, x: 0, duration: 0.45, ease: 'expo.out' });
      }
    });
  }

  figs.forEach(function (f, i) {
    var img = $('img', f);
    f.setAttribute('tabindex', '0');
    f.setAttribute('role', 'button');
    f.setAttribute('aria-label', 'View larger: ' + img.alt);
    f.dataset.cursor = 'View';
    f.addEventListener('click', function () { openLb(i); });
    f.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
    });
  });
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', function (e) { e.stopPropagation(); stepLb(-1); });
  $('#lbNext').addEventListener('click', function (e) { e.stopPropagation(); stepLb(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbImg) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowRight') stepLb(1);
      if (e.key === 'ArrowLeft') stepLb(-1);
    } else if (menuOpen && e.key === 'Escape') { setMenu(false); burger.focus(); }
  });

  // Everything below is animation. Without motion, stop here.
  if (!MOTION) return;

  /* ---------- 6. Custom cursor ---------- */
  var cursor = $('#cursor');
  var cursorLabel = $('#cursorLabel');
  if (FINE && cursor) {
    html.classList.add('has-cursor');
    var cx = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3' });
    var cy = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3' });
    window.addEventListener('mousemove', function (e) { cx(e.clientX); cy(e.clientY); cursor.classList.remove('is-hidden'); });
    document.addEventListener('mouseleave', function () { cursor.classList.add('is-hidden'); });

    document.addEventListener('mouseover', function (e) {
      var el = e.target.closest('[data-cursor], a, button, .reel-frame');
      cursor.classList.remove('is-big', 'is-link');
      cursorLabel.textContent = '';
      if (!el) return;
      if (el.classList.contains('reel-frame')) { cursor.classList.add('is-hidden'); return; }
      if (el.dataset.cursor) { cursorLabel.textContent = el.dataset.cursor; cursor.classList.add('is-big'); }
      else cursor.classList.add('is-link');
    });
  }

  /* ---------- 7. Magnetic buttons ---------- */
  if (FINE) {
    $$('.magnetic').forEach(function (el) {
      var mx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
      var my = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.3);
        my((e.clientY - r.top - r.height / 2) * 0.4);
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: true });
      });
    });
  }

  /* ---------- 8. Work index: floating preview ---------- */
  var list = $('#indexList');
  var preview = $('#indexPreview');
  if (FINE && list && preview) {
    var pImg = $('img', preview);
    var links = $$('a', list);
    links.forEach(function (a) { a.dataset.cursor = 'Open'; new Image().src = a.dataset.img; });
    var px = gsap.quickTo(preview, 'x', { duration: 0.7, ease: 'power3' });
    var py = gsap.quickTo(preview, 'y', { duration: 0.7, ease: 'power3' });
    var pr = gsap.quickTo(preview, 'rotation', { duration: 0.9, ease: 'power3' });
    var lastX = 0;
    gsap.set(preview, { xPercent: -50, yPercent: -50 });

    list.addEventListener('mouseenter', function () {
      gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
    });
    list.addEventListener('mouseleave', function () {
      gsap.to(preview, { autoAlpha: 0, scale: 0.85, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    });
    list.addEventListener('mousemove', function (e) {
      px(e.clientX); py(e.clientY);
      pr(gsap.utils.clamp(-6, 6, (e.clientX - lastX) * 0.4));
      lastX = e.clientX;
    });
    links.forEach(function (a) {
      a.addEventListener('mouseenter', function () {
        if (pImg.getAttribute('src') === a.dataset.img) return;
        pImg.src = a.dataset.img;
        gsap.fromTo(pImg, { scale: 1.25 }, { scale: 1, duration: 0.8, ease: 'expo.out' });
      });
    });
    gsap.set(preview, { scale: 0.85 });
  }

  /* ---------- 9. Nav hides on the way down, returns on the way up ---------- */
  var nav = $('#nav');
  var navHidden = false;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: function (self) {
      var hide = self.direction === 1 && self.scroll() > 240 && !menuOpen;
      if (hide !== navHidden) {
        navHidden = hide;
        gsap.to(nav, { yPercent: hide ? -110 : 0, duration: 0.6, ease: 'expo.out' });
      }
    }
  });

  /* ---------- 10. Wait for fonts, then build the text effects ---------- */
  var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  var timeout = new Promise(function (r) { setTimeout(r, 2500); });

  Promise.race([fontsReady, timeout]).then(function () {
    buildIntro();
    buildScroll();
  });

  /* ---------- 11. Preloader and hero entrance ---------- */
  function buildIntro() {
    var seen = false;
    try { seen = sessionStorage.getItem('rg-seen') === '1'; sessionStorage.setItem('rg-seen', '1'); } catch (e) {}
    var fast = seen ? 0.45 : 1; // repeat visits in the same session get a shorter intro

    var loader = $('#loader');
    var count = $('#loaderCount');
    var loaderSplit = SplitText.create('.loader-name', { type: 'chars' });
    var heroSplit = SplitText.create('.hn', { type: 'chars' });

    gsap.set(loaderSplit.chars, { yPercent: 110 });
    gsap.set(heroSplit.chars, { yPercent: 110 });
    gsap.set(['.hero-meta', '.hero-lead', '.hero-actions'], { autoAlpha: 0, y: 20 });
    gsap.set('.hero-photo', { clipPath: 'inset(100% 0 0 0)' });
    gsap.set('.hero-photo img', { scale: 1.3 });

    var heroImg = $('.hero-photo img');
    var imgReady = new Promise(function (r) {
      if (!heroImg || heroImg.complete) return r();
      heroImg.addEventListener('load', r); heroImg.addEventListener('error', r);
    });

    var counter = { v: 0 };
    var intro = gsap.timeline();
    intro
      .to(loaderSplit.chars, { yPercent: 0, duration: 0.9 * fast, ease: 'expo.out', stagger: 0.035 * fast })
      .to(counter, {
        v: 100, duration: 1.5 * fast, ease: 'power2.inOut',
        onUpdate: function () { count.textContent = Math.round(counter.v); }
      }, 0);

    Promise.all([imgReady, new Promise(function (r) { intro.eventCallback('onComplete', r); })]).then(function () {
      var out = gsap.timeline({
        onComplete: function () {
          html.classList.remove('is-loading');
          loader.remove();
          if (lenis) lenis.start();
          heroSplit.revert();      // back to plain text: crisper rendering, better for screen readers
          loaderSplit.revert();
          ScrollTrigger.refresh();
        }
      });
      out
        .to(loaderSplit.chars, { yPercent: -110, duration: 0.6, ease: 'expo.in', stagger: 0.02 })
        .to(count, { autoAlpha: 0, duration: 0.3 }, '<')
        .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=0.15')
        .to(heroSplit.chars, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.028 }, '-=0.55')
        .to('.hero-photo', { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.inOut' }, '-=1.1')
        .to('.hero-photo img', { scale: 1, duration: 1.6, ease: 'expo.out' }, '<')
        .to(['.hero-meta', '.hero-lead', '.hero-actions'], { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, '-=1.1');
    });
  }

  /* ---------- 12. Scroll-driven motion ---------- */
  function buildScroll() {
    // Hero drifts as you leave it
    gsap.to('.hero-photo img', {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero-name', {
      yPercent: -18, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // Headings rise line by line
    $$('.split-heading, .split-lines').forEach(function (el) {
      SplitText.create(el, {
        type: 'lines', mask: 'lines', autoSplit: true,
        onSplit: function (self) {
          return gsap.from(self.lines, {
            yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
          });
        }
      });
    });

    // The statement lights up word by word as you scroll through it
    var st = $('#statement');
    if (st) {
      SplitText.create(st, {
        type: 'words', autoSplit: true,
        onSplit: function (self) {
          return gsap.fromTo(self.words, { opacity: 0.14 }, {
            opacity: 1, ease: 'none', stagger: 0.1,
            scrollTrigger: { trigger: st, start: 'top 78%', end: 'bottom 45%', scrub: true }
          });
        }
      });
    }

    // Images open from the bottom like a shutter
    $$('.reveal-media, .cases .media, .video .case .media').forEach(function (m) {
      var img = $('img', m);
      var tl = gsap.timeline({ scrollTrigger: { trigger: m, start: 'top 90%', once: true } });
      tl.fromTo(m, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' })
        .fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.6, ease: 'expo.out', clearProps: 'transform' }, '<0.1');
    });

    // Rows slide in: index, services, experience
    [['.index-list li', '#indexList'], ['.service-list li', '.service-list']].forEach(function (p) {
      gsap.from(p[0], {
        y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.07,
        scrollTrigger: { trigger: p[1], start: 'top 85%', once: true }
      });
    });
    $$('.exp').forEach(function (row) {
      var tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 88%', once: true } });
      tl.fromTo(row, { '--s': 0 }, { '--s': 1, duration: 1.2, ease: 'expo.inOut' })
        .from(row.children, { y: 24, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06 }, '<0.25');
    });

    // Reels fade up together
    gsap.from('.reel', {
      y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: '.reels', start: 'top 85%', once: true }
    });

    // Tool lists and facts
    gsap.from('.tool-groups > div, .facts > div', {
      y: 24, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05,
      scrollTrigger: { trigger: '.facts', start: 'top 88%', once: true }
    });

    // Marquee: loops forever, speeds up and follows the direction you scroll
    var track = $('#marqueeTrack');
    if (track) {
      $$('img', track).forEach(function (img) { track.appendChild(img.cloneNode(true)); });
      var loop = gsap.to(track, { xPercent: -50, duration: 50, ease: 'none', repeat: -1 });
      var dir = 1;
      ScrollTrigger.create({
        trigger: '.marquee', start: 'top bottom', end: 'bottom top',
        onUpdate: function (self) {
          dir = self.direction;
          var boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6);
          gsap.to(loop, { timeScale: boost * dir, duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.2, ease: 'power2.out' });
        }
      });
    }

    // Range gallery: scroll sideways on desktop, native swipe elsewhere
    var mm = gsap.matchMedia();
    var viewport = $('.range-viewport');
    var rtrack = $('#rangeTrack');
    mm.add('(min-width: 861px) and (hover: hover)', function () {
      var dist = function () { return Math.max(0, rtrack.scrollWidth - viewport.clientWidth); };
      gsap.to(rtrack, {
        x: function () { return -dist(); },
        ease: 'none',
        scrollTrigger: {
          trigger: viewport, pin: true, start: 'center 55%',
          end: function () { return '+=' + dist(); },
          scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
        }
      });
    });
    mm.add('(max-width: 860px), (hover: none)', function () {
      viewport.classList.add('is-native');
      return function () { viewport.classList.remove('is-native'); };
    });

    // Contact email and footer name
    gsap.from('.contact-email', {
      y: 40, autoAlpha: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: '.contact-email', start: 'top 92%', once: true }
    });
    var foot = SplitText.create('.footer-name', { type: 'chars' });
    gsap.from(foot.chars, {
      yPercent: 100, duration: 1.2, ease: 'expo.out', stagger: 0.03,
      scrollTrigger: { trigger: '.footer', start: 'top 95%', once: true }
    });

    // Late-loading images change the page height; re-measure once they're in
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
})();
