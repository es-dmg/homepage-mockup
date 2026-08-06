/* ==========================================================================
   DMG homepage — VERSION 2 ("The Dossier") behaviour
   main.js runs first: shared nav, the .stat/.count count-ups and the scroll
   reveals all come from there. This file adds only what v2 introduces.
   Every animated behaviour checks prefers-reduced-motion.
   ========================================================================== */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Masthead: the video plate fades up, then the H1 rises.
     main.js only drives a .hero, and v2's masthead is .dx-mast.
  ------------------------------------------------------------------ */
  var mast = document.querySelector('.dx-mast');
  if (mast) {
    var vid = mast.querySelector("video");
    if (vid) {
      if (reduced) {
        vid.pause();
        vid.removeAttribute('autoplay');
        vid.classList.add('is-playing');   // keep the still frame
      } else {
        vid.addEventListener('canplay', function () { vid.classList.add('is-playing'); });
        vid.addEventListener('error', function () { vid.classList.remove('is-playing'); });
      }
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { mast.classList.add('is-on'); });
    });
  }


  /* ------------------------------------------------------------------
     Figures table: the rule under each figure fills as its number lands.
     main.js already toggles .is-done on .stat elements, and each .dx-fig
     carries .stat, so nothing more is needed here.
  ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------
     Masthead contents links scroll to their article and flash its rule, so a
     reader who clicks "Scheduling" can see which of the five they landed on.
  ------------------------------------------------------------------ */
  document.querySelectorAll('[data-jump]').forEach(function (link) {
    link.addEventListener('click', function () {
      var i = parseInt(link.getAttribute('data-jump'), 10);
      var art = document.getElementById('dx-a' + i);
      if (!art) return;
      art.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      art.classList.add('is-target');
      setTimeout(function () { art.classList.remove('is-target'); }, 1600);
    });
  });

  /* ------------------------------------------------------------------
     Testimonials — prev/next/dots, keyboard, 15s auto-advance.
     Same contract as v1, different markup.
  ------------------------------------------------------------------ */
  var stage = document.getElementById('v2-stage');
  if (stage) {
    var quotes = Array.prototype.slice.call(stage.querySelectorAll('.dx-q'));
    var dots = Array.prototype.slice.call(stage.querySelectorAll('[data-v2goto]'));
    var current = 0, swapping = false, auto = null;
    var AUTO_MS = 15000;

    function go(next) {
      next = (next + quotes.length) % quotes.length;
      if (next === current || swapping) return;
      dots.forEach(function (d, i) { d.setAttribute('aria-current', String(i === next)); });

      if (reduced) {
        quotes[current].classList.remove('is-active');
        quotes[next].classList.add('is-active');
        current = next;
        return;
      }
      swapping = true;
      var out = quotes[current];
      out.classList.add('is-leaving');
      setTimeout(function () {
        out.classList.remove('is-active', 'is-leaving');
        var incoming = quotes[next];
        incoming.classList.add('is-active', 'is-leaving');
        void incoming.offsetWidth;
        incoming.classList.remove('is-leaving');
        current = next;
        swapping = false;
      }, 400);
    }

    function startAuto() {
      if (reduced || quotes.length < 2) return;
      stopAuto();
      auto = setInterval(function () { go(current + 1); }, AUTO_MS);
    }
    function stopAuto() { if (auto) { clearInterval(auto); auto = null; } }
    function advance(i) { go(i); startAuto(); }

    var prev = document.getElementById('v2-prev');
    var next = document.getElementById('v2-next');
    if (prev) prev.addEventListener('click', function () { advance(current - 1); });
    if (next) next.addEventListener('click', function () { advance(current + 1); });
    dots.forEach(function (d) {
      d.addEventListener('click', function () { advance(parseInt(d.getAttribute('data-v2goto'), 10)); });
    });
    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); advance(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); advance(current + 1); }
    });
    stage.addEventListener('mouseenter', stopAuto);
    stage.addEventListener('mouseleave', startAuto);
    stage.addEventListener('focusin', stopAuto);
    stage.addEventListener('focusout', startAuto);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAuto(); else startAuto();
    });
    startAuto();
  }

})();
