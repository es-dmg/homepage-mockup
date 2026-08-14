/* ==========================================================================
   DMG homepage — VERSION 3 behaviour
   main-v3.js (V3's own copy of the shared script) runs first: nav, count-ups,
   reveals, the hero measuring rule and the V1 testimonial carousel all come
   from there. This file adds only what V3 introduces.
   ========================================================================== */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     The origin animation is SMIL, and SMIL cannot be stopped from CSS:
     display:none does not halt <animate> timelines. So the gate lives
     here: under prefers-reduced-motion, and below 768px where the mark
     gets dense, the document clock is moved past the last keyframe and
     paused, which renders the finished mark with zero motion.
  ------------------------------------------------------------------ */
  var origin = document.getElementById('v3-origin');

  function pinFinalFrame() {
    if (!origin) return;
    try {
      origin.setCurrentTime(10);  /* past the 8.7s end; all fill="freeze" states resolve */
      origin.pauseAnimations();
    } catch (e) { /* older engines without SMIL just show the resting shapes */ }
  }

  if (origin && (reduced || window.innerWidth < 913)) {
    pinFinalFrame();
    /* belt and braces: re-pin after full load in case the SMIL clock was
       reset while late subresources were still arriving */
    window.addEventListener('load', pinFinalFrame);
  }

  /* If the viewport is later resized below the stacking breakpoint mid-
     animation, finish it rather than letting it keep playing small. One-way:
     growing the window back does not restart a sequence that plays once. */
  if (origin && !reduced && window.innerWidth >= 913) {
    var mq = window.matchMedia('(max-width: 912px)');
    var onNarrow = function (e) { if (e.matches) pinFinalFrame(); };
    if (mq.addEventListener) mq.addEventListener('change', onNarrow);
  }

  /* ------------------------------------------------------------------
     The resting pose: once the mark has formed (collapse ends ~7.0s), it
     expands and glides to the lower right of the hero at 50% opacity,
     roughly two thirds of the hero tall and slightly cropped by the
     hero's bottom edge. The scale is capped so the watermark can never
     reach the text column. Reduced-motion desktops get the pose
     instantly with no motion; small screens keep the modest in-flow mark.
  ------------------------------------------------------------------ */
  var wrap = document.querySelector('.v3-origin-wrap');
  var hero = document.querySelector('.v3-hero');
  var heroText = document.querySelector('.v3-hero .hero-text');

  function restPose(animate) {
    if (!wrap || !hero) return;
    var hr = hero.getBoundingClientRect();
    var wr = wrap.getBoundingClientRect();
    var markH = wr.height * 0.35;   /* the mark's share of the svg box */
    var sH = (hr.height * 2 / 3) / markH;
    var textRight = heroText ? heroText.getBoundingClientRect().right : hr.left;
    /* proportional right inset so the mark never crowds or clips the edge on
       any window width */
    var rightPad = Math.max(40, hr.width * 0.06);
    var maxW = (hr.right - rightPad) - (textRight + 16);
    var s = Math.max(1, Math.min(sH, maxW / markH));
    var mark = markH * s;
    var cx = hr.right - mark / 2 - rightPad;
    var cy = hr.bottom - mark / 2 + mark * 0.08;   /* 8% of it dips past the edge */
    var dx = cx - (wr.left + wr.width / 2);
    var dy = cy - (wr.top + wr.height / 2);
    if (animate) {
      wrap.style.transition = 'transform 1400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 1400ms cubic-bezier(0.4, 0, 0.2, 1)';
    }
    wrap.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
    wrap.style.opacity = '0.5';
  }

  if (origin && window.innerWidth >= 913) {
    if (reduced) {
      restPose(false);
    } else {
      setTimeout(function () { restPose(true); }, 7100);
    }
  }

  /* ------------------------------------------------------------------
     The hero copy line receives the three phrases as they leave the
     diagram: it stays hidden until the in-diagram labels begin fading
     (3.2s into the sequence), then fades up. Skipped wherever the
     animation itself is pinned static: reduced motion and small screens
     see the line immediately.
  ------------------------------------------------------------------ */
  var lede = document.querySelector('.v3-hero .hero-expertise');
  var phrases = document.querySelectorAll('.v3-hero .v3-ph');
  /* the three label groups inside the svg, in the same order as the phrases:
     top (student outcomes), right (operational efficiency), left (resource
     allocation) */
  var labelGroups = origin ? origin.querySelectorAll('g[text-anchor]') : [];

  /* Shared-text handoff: at each label's dissolve, a ghost of the phrase
     (already in its destination style) lifts off from the label's exact
     position and glides into its slot in the sentence, then the real span
     takes over. Reads as one text box relocating from diagram to copy. */
  function flyPhrase(i) {
    var span = phrases[i];
    var g = labelGroups[i];
    if (!span || !g || !hero) { if (span) span.classList.remove('v3-ph-wait'); return; }
    var hb = hero.getBoundingClientRect();
    var sr = g.getBoundingClientRect();
    var tr = span.getBoundingClientRect();
    var ghost = document.createElement('span');
    ghost.className = 'v3-ghost';
    ghost.textContent = span.textContent;
    ghost.style.font = getComputedStyle(span).font;
    ghost.style.left = (tr.left - hb.left) + 'px';
    ghost.style.top = (tr.top - hb.top) + 'px';
    var dx = (sr.left + sr.width / 2) - (tr.left + tr.width / 2);
    var dy = (sr.top + sr.height / 2) - (tr.top + tr.height / 2);
    var k = Math.max(1, (sr.height / Math.max(1, tr.height)) * 0.6);
    ghost.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + k.toFixed(2) + ')';
    ghost.style.opacity = '0';
    hero.appendChild(ghost);
    void ghost.offsetWidth;
    ghost.style.transform = 'none';
    ghost.style.opacity = '1';
    setTimeout(function () {
      /* seamless swap: the real span appears instantly exactly where the
         ghost stopped, then the ghost is removed */
      span.style.transition = 'none';
      span.classList.remove('v3-ph-wait');
      void span.offsetWidth;
      span.style.transition = '';
      if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
    }, 950);
  }

  if (lede && origin && !reduced && window.innerWidth >= 913) {
    lede.classList.add('v3-lede-wait');
    phrases.forEach(function (ph) { ph.classList.add('v3-ph-wait'); });
    /* the line's scaffolding appears as the first label dissolves */
    setTimeout(function () { lede.classList.remove('v3-lede-wait'); }, 3500);
    var DEPART = [3600, 3900, 4200];
    DEPART.forEach(function (t, i) {
      setTimeout(function () { flyPhrase(i); }, t);
    });
  }

  /* ------------------------------------------------------------------
     Jump links: the native anchor scrolls (smooth-scroll is disabled by
     the shared reduced-motion block); this only flashes the landing
     chapter's title rule so the reader can see which one they hit.
  ------------------------------------------------------------------ */
  document.querySelectorAll('[data-open-row]').forEach(function (link) {
    link.addEventListener('click', function () {
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target || !target.classList.contains('dx-ch')) return;
      target.classList.add('is-target');
      setTimeout(function () { target.classList.remove('is-target'); }, 1600);
    });
  });

})();
