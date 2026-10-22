/* Rollan Guzman — site behaviour. No libraries.
   1. Local clock      2. Portal hero (scroll-bound, reversible)
   3. Statement orb    4. Throwable deck    5. Reels (click to load)
   6. One-shot reveals */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) root.classList.add('motion');

  /* 1. Clock, Cagayan de Oro time */
  var clock = document.getElementById('clock');
  function tick() {
    try {
      clock.textContent = new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Manila' }).format(new Date()) + ' local';
    } catch (e) {}
  }
  if (clock) { tick(); setInterval(tick, 30000); }

  /* 2 + 3. Scroll-bound motion. Every value comes from scroll position,
     so scrolling back up plays it in reverse. */
  var portal = document.querySelector('.portal');
  var stage = portal && portal.querySelector('.stage');
  var title = portal && portal.querySelector('.portal-title');
  var fold = document.querySelector('.fold');
  var orb = document.querySelector('.orb');
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };

  function frame() {
    var vh = window.innerHeight;
    if (portal) {
      var r = portal.getBoundingClientRect();
      var span = r.height - vh;
      var p = clamp(-r.top / (span * 0.85));   // fully open a little before the stage unsticks
      var e = ease(p);
      stage.style.setProperty('--open', e.toFixed(4));
      stage.style.setProperty('--img-s', (1.16 - 0.16 * e).toFixed(4));
      stage.style.setProperty('--wash', (0.38 * e).toFixed(4));
      // Grow AND tighten together: the title opens rather than zooms.
      title.style.setProperty('--title-s', (1 + 0.12 * e).toFixed(4));
      title.style.setProperty('--track', (0.05 - 0.08 * e).toFixed(4) + 'em');
    }
    if (orb && fold) {
      var f = fold.getBoundingClientRect();
      var q = (vh - f.top) / (vh + f.height); // 0 entering, 1 leaving
      orb.style.setProperty('--orb-y', ((q - 0.5) * -160).toFixed(1) + 'px');
      orb.style.setProperty('--orb-r', ((q - 0.5) * 40).toFixed(2) + 'deg');
    }
  }
  var queued = false;
  function onScroll() { if (!queued) { queued = true; requestAnimationFrame(function () { queued = false; frame(); }); } }
  // Start at the very top on every visit, including back/forward and mobile restores.
  function toTop() { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
  toTop();
  window.addEventListener('load', function () { toTop(); frame(); });
  window.addEventListener('pageshow', function (ev) { if (ev.persisted) { toTop(); frame(); } });
  if (!reduce) {
    frame();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* 4. Throwable deck */
  var deck = document.getElementById('deck');
  if (deck) {
    var cards = Array.prototype.slice.call(deck.querySelectorAll('.card'));
    var order = cards.map(function (_, i) { return i; });   // order[0] = top card
    var N = cards.length, busy = false;
    var dotsEl = document.getElementById('dots'), countEl = document.getElementById('count');
    var dots = cards.map(function () { var d = document.createElement('i'); dotsEl.appendChild(d); return d; });
    deck.classList.add('is-deck');
    cards.forEach(function (c) { c.querySelectorAll('img').forEach(function (im) { im.loading = 'eager'; }); });

    var restT = function (d) {
      var k = Math.min(d, 4);
      return 'translate(' + (k * 9) + 'px,' + (k * -8) + 'px) scale(' + (1 - k * 0.035) + ') rotate(' + (k * 1.8) + 'deg)';
    };
    function stack() {
      order.forEach(function (ci, d) {
        var c = cards[ci];
        c.style.zIndex = N - d;
        c.style.transform = restT(d);
        c.style.opacity = d > 4 ? 0 : 1;
        c.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
      });
      var top = order[0];
      dots.forEach(function (d, i) { d.classList.toggle('on', i === top); });
      countEl.textContent = String(top + 1).padStart(2, '0') + ' / ' + N;
    }
    stack();

    function throwTop(dir, dy) {
      if (busy) return;
      busy = true;
      var c = cards[order[0]], w = deck.offsetWidth;
      c.style.transition = 'transform .45s cubic-bezier(.3,.6,.3,1), opacity .45s';
      c.style.transform = 'translate(' + (dir * w * 1.15) + 'px,' + ((dy || 0) - 40) + 'px) rotate(' + (dir * 26) + 'deg)';
      c.style.opacity = '0';
      setTimeout(function () {
        c.style.transition = 'none';
        order.push(order.shift());
        stack();
        void c.offsetWidth;
        c.style.transition = '';
        busy = false;
      }, 430);
    }
    function bringBack() {
      if (busy) return;
      busy = true;
      var ci = order.pop(); order.unshift(ci);
      var c = cards[ci], w = deck.offsetWidth;
      c.style.transition = 'none';
      c.style.zIndex = N + 1;
      c.style.opacity = '0';
      c.style.transform = 'translate(' + (-w * 1.15) + 'px,-40px) rotate(-26deg)';
      void c.offsetWidth;
      c.style.transition = '';
      stack();
      setTimeout(function () { busy = false; }, 420);
    }
    function step(dir) {
      if (reduce) {               // no flying cards, just swap
        if (dir > 0) order.push(order.shift()); else order.unshift(order.pop());
        stack(); return;
      }
      if (dir > 0) throwTop(1); else bringBack();
    }

    var drag = null;
    deck.addEventListener('pointerdown', function (ev) {
      if (busy || ev.button > 0) return;
      var c = cards[order[0]];
      if (!c.contains(ev.target)) return;
      drag = { x: ev.clientX, y: ev.clientY, dx: 0, dy: 0, c: c, id: ev.pointerId };
      deck.setPointerCapture(ev.pointerId);
      c.style.transition = 'none';
      deck.classList.add('dragging');
    });
    deck.addEventListener('pointermove', function (ev) {
      if (!drag || ev.pointerId !== drag.id) return;
      drag.dx = ev.clientX - drag.x; drag.dy = ev.clientY - drag.y;
      drag.c.style.transform = 'translate(' + drag.dx + 'px,' + drag.dy + 'px) rotate(' + (drag.dx * 0.06) + 'deg) scale(1.02)';
    });
    function release(ev) {
      if (!drag || ev.pointerId !== drag.id) return;
      var d = drag; drag = null;
      deck.classList.remove('dragging');
      d.c.style.transition = '';
      if (Math.abs(d.dx) > deck.offsetWidth * 0.1) throwTop(d.dx > 0 ? 1 : -1, d.dy);
      else stack();
    }
    deck.addEventListener('pointerup', release);
    deck.addEventListener('pointercancel', release);
    deck.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowRight') { ev.preventDefault(); step(1); }
      else if (ev.key === 'ArrowLeft') { ev.preventDefault(); step(-1); }
    });
    document.querySelectorAll('.arrow').forEach(function (b) {
      b.addEventListener('click', function () { step(+b.dataset.dir); });
    });
  }

  /* 5. Reels: show a Drive thumbnail, load the player on click */
  document.querySelectorAll('.reel-play').forEach(function (btn) {
    var img = btn.querySelector('img');
    if (img) img.addEventListener('error', function () { img.remove(); });
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://drive.google.com/file/d/' + btn.dataset.id + '/preview';
      f.title = btn.dataset.title;
      f.allow = 'autoplay; fullscreen';
      f.setAttribute('allowfullscreen', '');
      btn.replaceWith(f);
    });
  });

  /* 6. Reveals: fire once, never un-reveal */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
})();
