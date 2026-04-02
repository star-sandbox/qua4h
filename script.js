/* ============================================================
   ECO-EYE — Site scripts: nav, dropdowns, scroll reveal, spy
============================================================ */

(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (!nav || !navToggle || !navLinks) return;

  function currentPage() {
    var pathStr = window.location.pathname || '';
    var p = pathStr.split('/').pop();
    if (!p || p === '') return 'index.html';
    return p;
  }

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* Mobile menu */
  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (link.getAttribute('aria-haspopup') === 'true') return;
      closeAllDropdowns();
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Dropdown toggles (mobile / touch) */
  var mqMobile = window.matchMedia('(max-width: 640px)');

  function closeAllDropdowns() {
    navLinks.querySelectorAll('.nav__item.open').forEach(function (item) {
      item.classList.remove('open');
      var t = item.querySelector('a[aria-haspopup="true"]');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  navLinks.querySelectorAll('.nav__item > a[aria-haspopup="true"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (!mqMobile.matches) return;
      e.preventDefault();
      var item = a.closest('.nav__item');
      var willOpen = !item.classList.contains('open');
      closeAllDropdowns();
      if (willOpen) {
        item.classList.add('open');
        a.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!mqMobile.matches) return;
    if (!navLinks.contains(e.target)) closeAllDropdowns();
  });

  function setActiveNav() {
    var p = currentPage();

    navLinks.querySelectorAll('a[data-nav]').forEach(function (a) {
      var key = a.getAttribute('data-nav');
      var active = false;
      if (key === 'home' && p === 'index.html') active = true;
      else if (key === 'product' && p === 'product.html') active = true;
      else if (key === 'market' && p === 'market.html') active = true;
      else if (key === 'roadmap' && p === 'roadmap.html') active = true;
      else if (key === 'company' && (p === 'company.html' || p === 'team.html')) active = true;
      else if (key === 'partners' && p === 'partners.html') active = true;
      a.classList.toggle('active', active);
    });

    navLinks.querySelectorAll('.nav__dropdown a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.indexOf('#') === -1) return;
      var parts = href.split('#');
      var file = parts[0].split('/').pop() || 'index.html';
      if (!parts[0]) file = p;
      var hash = parts[1];
      var active = file === p && window.location.hash === '#' + hash;
      a.classList.toggle('active-link', active);
    });
  }

  setActiveNav();
  window.addEventListener('hashchange', setActiveNav);

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -48px 0px',
      }
    );

    revealEls.forEach(function (el) {
      var parent = el.parentElement;
      var siblings = parent ? parent.querySelectorAll('.reveal') : [];
      if (siblings.length > 1) {
        var siblingIndex = Array.from(siblings).indexOf(el);
        el.style.transitionDelay = siblingIndex * 0.09 + 's';
      }
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* Smooth scroll for in-page anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;

      if (!CSS.supports('scroll-behavior', 'smooth')) {
        e.preventDefault();
        var navH = nav ? nav.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
})();
