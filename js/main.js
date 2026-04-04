/* ============================================
   CONNECTIFY MEDIA — Main JavaScript
============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ---- Navbar scroll effect ----
  const navbar = document.querySelector('.navbar');
  function handleScroll() {
    if (window.scrollY > 40) {
      navbar && navbar.classList.add('scrolled');
    } else {
      navbar && navbar.classList.remove('scrolled');
    }
    // Back to top
    const btt = document.querySelector('.back-to-top');
    if (btt) {
      if (window.scrollY > 400) btt.classList.add('visible');
      else btt.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Mobile menu ----
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ---- Active nav link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a, .mobile-menu a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.classList.remove('open');
      });

      // Open clicked
      if (!isOpen) {
        item.classList.add('open');
        if (answer) answer.classList.add('open');
      }
    });
  });

  // ---- Reveal on scroll ----
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  // ---- Back to top ----
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    btt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Newsletter form → Google Sheets ----
  // To activate: deploy the Apps Script in newsletter-script.gs as a Web App,
  // then replace NEWSLETTER_ENDPOINT below with your deployed URL.
  var NEWSLETTER_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxaEJww9ZANPSP-DFK3bEu-nBNp4UVLXuPgJkWVOHACOhJkQJgUsImwlSPk2sx_xTmE_Q/exec';

  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var email = input ? input.value.trim() : '';
      if (!email) return;

      var btn = form.querySelector('button');
      if (btn) {
        var orig = btn.textContent;
        btn.textContent = 'Subscribing…';
        btn.disabled = true;

        fetch(NEWSLETTER_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, timestamp: new Date().toISOString() })
        }).finally(function () {
          if (input) input.value = '';
          btn.textContent = 'You\'re in!';
          btn.style.background = '#E7F1A8';
          btn.style.color = '#364C84';
          btn.disabled = false;
          setTimeout(function () {
            btn.textContent = orig;
            btn.style.background = '';
            btn.style.color = '';
          }, 3000);
        });
      }
    });
  });

  // ---- Contact form → native FormSubmit POST ----
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function () {
      var btn = this.querySelector('[type="submit"]');
      if (btn) {
        btn.innerHTML = 'Sending… <span class="material-icons-round" style="font-size:1.1rem;">hourglass_top</span>';
        btn.disabled = true;
      }
      // Allow native form POST to proceed to FormSubmit
    });
  }

  // ---- Counter animation ----
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 16);
  }
  const counterEls = document.querySelectorAll('[data-target]');
  if (counterEls.length > 0) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(function (el) { counterObserver.observe(el); });
  }

});
