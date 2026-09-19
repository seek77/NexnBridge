/* Nex & Bridge — shared behaviour. Keep small and dependency-free. */
(function () {
  'use strict';

  // Mobile nav toggle
  var nav = document.querySelector('nav.site-nav');
  var burger = document.querySelector('.nav-burger');
  var desktopMenu = window.matchMedia('(min-width:981px)');
  var menuCloseTimer;

  function cancelMenuClose() {
    window.clearTimeout(menuCloseTimer);
  }

  function closeDesktopMenus(except) {
    if (!nav || !desktopMenu.matches) return;
    nav.querySelectorAll('.has-mega, .has-dropdown').forEach(function (li) {
      if (li === except) return;
      li.classList.remove('desktop-open');
      // Suppress :focus-within when another menu is opened with the pointer.
      li.classList.add('menu-dismissed');
      li.querySelector('.submenu-toggle').setAttribute('aria-expanded', 'false');
    });
  }
  if (nav && burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      if (!open) closeSubmenus();
    });
    nav.querySelectorAll('.nav-menu > li > a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        closeSubmenus();
      });
    });
  }

  // Mega menu / dropdown — mobile accordion toggle
  // Desktop pointer state is kept across the header-to-panel gap below.
  document.querySelectorAll('.submenu-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var li = btn.closest('li');
      var wasOpen = li.classList.contains('open');
      li.parentElement.querySelectorAll(':scope > li.open').forEach(function (openLi) {
        if (openLi !== li) {
          openLi.classList.remove('open');
          openLi.querySelector('.submenu-toggle').setAttribute('aria-expanded', 'false');
        }
      });
      li.classList.toggle('open', !wasOpen);
      li.classList.remove('menu-dismissed');
      btn.setAttribute('aria-expanded', String(!wasOpen));
    });
  });

  function closeSubmenus() {
    cancelMenuClose();
    if (!nav) return;
    nav.querySelectorAll('.has-mega, .has-dropdown').forEach(function (li) {
      li.classList.remove('open', 'desktop-open');
      li.querySelector('.submenu-toggle').setAttribute('aria-expanded', 'false');
    });
  }
  if (nav) {
    nav.querySelectorAll('.has-mega, .has-dropdown').forEach(function (li) {
      function showDesktopState() {
        li.classList.remove('menu-dismissed');
        if (desktopMenu.matches) {
          cancelMenuClose();
          closeDesktopMenus(li);
          li.classList.add('desktop-open');
          li.querySelector('.submenu-toggle').setAttribute('aria-expanded', 'true');
        }
      }
      li.addEventListener('mouseenter', showDesktopState);
      li.addEventListener('focusin', showDesktopState);
      // Do not close on li mouseleave: the header padding is outside the li,
      // but is still the user's route into the absolutely positioned panel.
      li.addEventListener('focusout', function (event) {
        if (!li.contains(event.relatedTarget)) {
          li.classList.remove('menu-dismissed');
          if (!li.matches(':hover') && !li.classList.contains('open')) {
            li.classList.remove('desktop-open');
            li.querySelector('.submenu-toggle').setAttribute('aria-expanded', 'false');
          }
        }
      });
    });
    nav.addEventListener('mouseenter', cancelMenuClose);
    nav.addEventListener('mouseleave', function () {
      if (!desktopMenu.matches) return;
      cancelMenuClose();
      menuCloseTimer = window.setTimeout(function () {
        if (!nav.contains(document.activeElement)) closeDesktopMenus();
      }, 180);
    });
    nav.querySelectorAll('.nav-menu > li:not(.has-mega):not(.has-dropdown), .logo').forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        cancelMenuClose();
        closeDesktopMenus();
      });
    });
    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target)) {
        cancelMenuClose();
        closeDesktopMenus();
      }
    });
    desktopMenu.addEventListener('change', function () {
      closeSubmenus();
      nav.querySelectorAll('.menu-dismissed').forEach(function (li) {
        li.classList.remove('menu-dismissed');
      });
    });
    nav.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      var li = event.target.closest('.has-mega, .has-dropdown');
      closeSubmenus();
      if (li) {
        li.querySelector('a').focus();
        li.classList.add('menu-dismissed');
        li.querySelector('.submenu-toggle').setAttribute('aria-expanded', 'false');
      } else if (burger) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

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
