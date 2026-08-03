/* Nex & Bridge — shared behaviour. Keep small and dependency-free. */
(function () {
  'use strict';

  // Mobile nav toggle
  var nav = document.querySelector('nav.site-nav');
  var burger = document.querySelector('.nav-burger');
  if (nav && burger) {
    burger.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.querySelectorAll('.nav-menu > li > a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // Mega menu / dropdown — mobile accordion toggle
  // (desktop shows on :hover via CSS; this only drives the mobile tap-to-expand button)
  document.querySelectorAll('.submenu-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var li = btn.closest('li');
      var wasOpen = li.classList.contains('open');
      li.parentElement.querySelectorAll(':scope > li.open').forEach(function (openLi) {
        if (openLi !== li) openLi.classList.remove('open');
      });
      li.classList.toggle('open', !wasOpen);
    });
  });

  // Scroll-in animation, with a guaranteed fallback so content can never stay hidden
  var reveal = function (el) { el.classList.add('visible'); };
  var targets = document.querySelectorAll('.animate');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { reveal(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    targets.forEach(function (el) { obs.observe(el); });
  } else {
    targets.forEach(reveal);
  }
  setTimeout(function () { targets.forEach(reveal); }, 2500);

  // Compact the nav vertically on scroll without overriding responsive side padding
  if (nav) {
    var syncNavState = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 80);
    };
    syncNavState();
    window.addEventListener('scroll', syncNavState, { passive: true });
  }
})();
