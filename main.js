/* ==========================================================================
   DMG homepage prototype — main.js
   Vanilla JS. Every animated behavior checks prefers-reduced-motion.
   ========================================================================== */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Nav: transparent over hero -> white after 80px of scroll
  ------------------------------------------------------------------ */
  var nav = document.getElementById('site-nav');
  var SCROLL_THRESHOLD = 80;

  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Dropdowns: hover handled in CSS; click/tap/keyboard handled here */
  var dropButtons = nav.querySelectorAll('.nav-item > button[aria-controls]');
  dropButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var isOpen = item.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  function closeAllDropdowns() {
    nav.querySelectorAll('.nav-item.open').forEach(function (item) {
      item.classList.remove('open');
      var b = item.querySelector('button[aria-controls]');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) closeAllDropdowns();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  /* Mobile menu */
  var navToggle = nav.querySelector('.nav-toggle');
  navToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.querySelector('.material-symbols-rounded').textContent = open ? 'close' : 'menu';
  });

  /* ------------------------------------------------------------------
     Hero: video fade-up, then orchestrated entrance
  ------------------------------------------------------------------ */
  var hero = document.querySelector('.hero');
  var video = hero.querySelector('video');

  if (reducedMotion) {
    video.pause();
    video.removeAttribute('autoplay');
  } else {
    video.addEventListener('canplay', function () {
      video.classList.add('is-playing');
    });
    // if the file is missing, the dark-blue ground + poster hold the layout
    video.addEventListener('error', function () {
      video.classList.remove('is-playing');
    });
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      hero.classList.add('is-on');
    });
  });

  /* ------------------------------------------------------------------
     The measuring rule under the H1. It used to size itself to a rotating
     phrase; the rotator is gone, so it now measures the expertise line.
  ------------------------------------------------------------------ */
  var heroRule = document.getElementById("hero-rule");
  var expertise = hero.querySelector(".hero-expertise");

  function measureRule() {
    if (!heroRule || !expertise) return;
    // widest rendered line of the expertise copy, so the rule measures the text
    // rather than the full column when it wraps
    // a Range gives one rect per rendered LINE; the element's own rect would just
    // be the column width, so the rule would not hug the text
    var w = 0;
    try {
      var range = document.createRange();
      range.selectNodeContents(expertise);
      var rects = range.getClientRects();
      for (var i = 0; i < rects.length; i++) w = Math.max(w, rects[i].width);
    } catch (e) { /* fall through */ }
    if (!w) w = expertise.getBoundingClientRect().width;
    heroRule.style.width = Math.round(w) + "px";
  }

  measureRule();
  window.addEventListener("load", measureRule);
  window.addEventListener("resize", measureRule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureRule);

  /* ------------------------------------------------------------------
     Count-ups
  ------------------------------------------------------------------ */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function countUp(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var comma = el.getAttribute('data-format') === 'comma';
    var DURATION = 1100;
    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / DURATION);
      var v = Math.round(easeOutCubic(p) * target);
      el.textContent = (comma ? v.toLocaleString('en-US') : v) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------------
     Stat bar: count-ups + rule draw.
     These REPLAY: scrolling away and coming back re-runs the count, which is
     the one place on the page where repeating the animation is the point.
  ------------------------------------------------------------------ */
  var stats = document.querySelectorAll('.stat');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    stats.forEach(function (s) { s.classList.add('is-done'); });
  } else {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var stat = entry.target;
        var count = stat.querySelector('.count');
        if (entry.isIntersecting) {
          if (stat.dataset.running) return;
          stat.dataset.running = '1';
          stat.classList.add('is-done');   // rule draws while the number counts
          if (count) countUp(count);
        } else {
          // reset so the next entry replays from zero
          delete stat.dataset.running;
          stat.classList.remove('is-done');
          if (count) count.textContent = count.getAttribute('data-reset') || count.textContent;
        }
      });
    }, { threshold: 0.4 });
    stats.forEach(function (s) {
      var c = s.querySelector('.count');
      if (c) c.setAttribute('data-reset', c.textContent);
      statObserver.observe(s);
    });
  }

  /* ------------------------------------------------------------------
     Accordion: multiple rows may be open; an open row never auto-closes.
     Opening a row counts up its success-story stat, once.
  ------------------------------------------------------------------ */
  var rows = document.querySelectorAll('.hwh-row');

  /* Runs every time a row is expanded, not just the first time: re-opening a row
     replays its count-up. The rule and the emphasis marks redraw with it. */
  function runRowStat(row) {
    var stat = row.querySelector('.hwh-card .count');
    if (!stat) return;
    if (reducedMotion) return;   // markup already holds the final value
    countUp(stat);
  }

  function setRow(row, open) {
    var btn = row.querySelector('.hwh-toggle');
    row.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open) runRowStat(row);
  }

  rows.forEach(function (row) {
    var btn = row.querySelector('.hwh-toggle');
    btn.addEventListener('click', function () {
      setRow(row, !row.classList.contains('open'));
    });
  });

  /* No row is open on load now, but this keeps working if one ever is. */
  var firstOpen = document.querySelector('.hwh-row.open');
  if (firstOpen) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      runRowStat(firstOpen);
    } else {
      var rowObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          rowObserver.unobserve(entry.target);
          runRowStat(entry.target);
        });
      }, { threshold: 0.25 });
      rowObserver.observe(firstOpen);
    }
  }

  /* Quiet hero row + nav/footer bucket links: open the row, then anchor-scroll */
  document.querySelectorAll('[data-open-row]').forEach(function (link) {
    link.addEventListener('click', function () {
      var id = link.getAttribute('href').slice(1);
      var row = document.getElementById(id);
      if (row && row.classList.contains('hwh-row')) setRow(row, true);
      if (nav.classList.contains('menu-open')) navToggle.click();
      closeAllDropdowns();
    });
  });

  /* ------------------------------------------------------------------
     Scroll reveals: fire once, then unobserve
  ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------
     Testimonials: arrows, dots, keyboard; quote crossfade + photo scale
  ------------------------------------------------------------------ */
  var stage = document.getElementById('testimonials');
  var slides = stage.querySelectorAll('.testimonial');
  var dots = stage.querySelectorAll('.t-dot');
  var current = 0;
  var swapping = false;

  function goTo(next) {
    next = (next + slides.length) % slides.length;
    if (next === current || swapping) return;

    dots.forEach(function (d, i) {
      d.setAttribute('aria-current', String(i === next));
    });

    if (reducedMotion) {
      slides[current].classList.remove('active');
      slides[next].classList.add('active');
      current = next;
      return;
    }

    swapping = true;
    var out = slides[current];
    out.classList.add('is-swapping');
    setTimeout(function () {
      out.classList.remove('active');
      out.classList.remove('is-swapping');
      var incoming = slides[next];
      incoming.classList.add('is-swapping');
      incoming.classList.add('active');
      void incoming.offsetWidth;
      incoming.classList.remove('is-swapping');
      current = next;
      swapping = false;
    }, 400);
  }

  document.getElementById('t-prev').addEventListener('click', function () { advance(current - 1); });
  document.getElementById('t-next').addEventListener('click', function () { advance(current + 1); });
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      advance(parseInt(dot.getAttribute('data-goto'), 10));
    });
  });
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); advance(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); advance(current + 1); }
  });

  /* Auto-advance every 15s. Pauses on hover and on focus, and any manual
     interaction restarts the clock so it never yanks the slide out from under
     someone who just clicked. Off entirely under reduced motion. */
  var AUTO_MS = 15000;
  var autoTimer = null;

  function startAuto() {
    if (reducedMotion || slides.length < 2) return;
    stopAuto();
    autoTimer = setInterval(function () { goTo(current + 1); }, AUTO_MS);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }
  function advance(i) { goTo(i); startAuto(); }

  stage.addEventListener('mouseenter', stopAuto);
  stage.addEventListener('mouseleave', startAuto);
  stage.addEventListener('focusin', stopAuto);
  stage.addEventListener('focusout', startAuto);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { stopAuto(); } else { startAuto(); }
  });
  startAuto();

  /* ------------------------------------------------------------------
     Marquee: whichever logo is nearest the horizontal centre grows to 1.2x and
     drops its blue tint. Polled rather than transitioned per-logo, because the
     track is a single CSS transform and individual logos have no scroll events.
     The poll only runs while the marquee is on screen.
  ------------------------------------------------------------------ */
  var marquee = document.querySelector('.marquee');
  if (marquee && !reducedMotion && 'IntersectionObserver' in window) {
    var mlogos = marquee.querySelectorAll('.mlogo');
    var centerTimer = null;

    function markCentre() {
      var box = marquee.getBoundingClientRect();
      var mid = box.left + box.width / 2;
      var best = null, bestDist = Infinity;
      mlogos.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.width === 0) return;
        var d = Math.abs((r.left + r.width / 2) - mid);
        if (d < bestDist) { bestDist = d; best = el; }
      });
      mlogos.forEach(function (el) {
        el.classList.toggle('is-centered', el === best && bestDist < box.width / 2);
      });
    }

    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !centerTimer) {
          markCentre();
          centerTimer = setInterval(markCentre, 120);
        } else if (!entry.isIntersecting && centerTimer) {
          clearInterval(centerTimer);
          centerTimer = null;
          mlogos.forEach(function (el) { el.classList.remove('is-centered'); });
        }
      });
    }, { threshold: 0.1 }).observe(marquee);
  }

  /* ------------------------------------------------------------------
     Testimonial rings: rotate into place on arrival, rotate back out on the way
     past, so returning replays the movement.

     This watches the PHOTO, not the section. Watching the section meant the
     rings finished rotating while only the heading was on screen, so the
     movement was over before the artwork was ever visible.
  ------------------------------------------------------------------ */
  var partners = document.querySelector('.partners');
  var ringTargets = stage.querySelectorAll('.t-photo');
  if (partners && ringTargets.length && !reducedMotion && 'IntersectionObserver' in window) {
    /* Every photo is observed, not just the first. An inactive slide is
       display:none and always reports "not intersecting", so in practice this
       tracks whichever photo is currently shown. Observing only the first one
       broke the rings as soon as the carousel advanced past it. */
    var visible = new WeakMap();
    var ringObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible.set(entry.target, entry.isIntersecting);
      });
      var anyVisible = false;
      ringTargets.forEach(function (t) { if (visible.get(t)) anyVisible = true; });
      partners.classList.toggle('rings-in', anyVisible);
    }, { threshold: 0.55 });
    ringTargets.forEach(function (t) { ringObserver.observe(t); });
  } else if (partners) {
    partners.classList.add('rings-in');
  }

})();
