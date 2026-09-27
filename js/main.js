// ============================================
// BALLINA SHIRE YOUTH ARTISTS - Main JS
// ============================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- Mobile Navigation ----
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ---- Scroll Reveal Animations ----
  var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  function checkReveal() {
    var windowHeight = window.innerHeight;
    revealElements.forEach(function (el) {
      var elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkReveal);
  checkReveal(); // Run on load

  // ---- Gallery Filter (Gallery page) ----
  var filterBtns = document.querySelectorAll('.filter-btn');
  var masonryItems = document.querySelectorAll('.masonry-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active button
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');

      masonryItems.forEach(function (item) {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ---- Simple Contact Form Handler ----
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstName = document.getElementById('firstName').value;
      var email = document.getElementById('email').value;

      // For now, show a thank you message
      contactForm.innerHTML =
        '<div style="text-align: center; padding: 60px 20px;">' +
        '<div style="font-size: 3rem; margin-bottom: 16px;">&#127881;</div>' +
        '<h3 style="font-family: var(--font-hand); font-size: 2rem; margin-bottom: 12px;">Thanks, ' + firstName + '!</h3>' +
        '<p style="color: #666;">We\'ve received your message and will get back to you at <strong>' + email + '</strong> soon.</p>' +
        '</div>';
    });
  }

  // ---- Mailing List Form Handler ----
  var mailingListForm = document.getElementById('mailingListForm');
  if (mailingListForm) {
    mailingListForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = mailingListForm.querySelector('input[name="name"]').value;
      mailingListForm.innerHTML =
        '<div style="padding: 20px 0;">' +
        '<div style="font-size: 2rem; margin-bottom: 8px;">&#127881;</div>' +
        '<h3 style="font-family: var(--font-hand); font-size: 1.6rem; margin-bottom: 8px;">You\'re in, ' + name + '!</h3>' +
        '<p style="color: #666; font-size: 0.95rem;">We\'ll keep you posted on all things BSYA.</p>' +
        '</div>';
    });
  }

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });
});
