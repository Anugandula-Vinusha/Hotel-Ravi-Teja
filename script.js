/* ═══════════════════════════════════════════════
   HOTEL RAVI TEJA — JAVASCRIPT
   ═══════════════════════════════════════════════ */

'use strict';

// ── Gallery Images ──────────────────────────────
const galleryImages = [
  { src: 'assets/hero_room.png',      alt: 'Luxurious room interior at Hotel Ravi Teja' },
  { src: 'assets/hotel_exterior.png', alt: 'Hotel Ravi Teja exterior view' },
  { src: 'assets/deluxe_room.png',    alt: 'Standard room at Hotel Ravi Teja' },
  { src: 'assets/executive_room.png', alt: 'Deluxe AC room at Hotel Ravi Teja' },
  { src: 'assets/suite_room.png',     alt: 'Premium suite at Hotel Ravi Teja' },
  { src: 'assets/hotel_lobby.png',    alt: 'Hotel Ravi Teja reception lobby' },
];

let currentLightboxIndex = 0;

// ── DOM Ready ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initParallax();
  initTiltCards();
  initLightbox();
  initReviewsSlider();
  initForm();
  initBackToTop();
  initSmoothScroll();
  initAvailabilityDates();
  initActiveNavLinks();
});

// ── Navbar ───────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

// ── Active Nav Links ─────────────────────────────
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ── Mobile Menu ──────────────────────────────────
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

  const openMenu = () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger?.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on backdrop click
  mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// ── Scroll Animations ────────────────────────────
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.feature-card, .room-card, .review-card, .amenity-card, .gallery-item, .about-pillar, .location-detail, .section-label, .section-title, .section-subtitle'
  );

  elements.forEach(el => {
    el.classList.add('fade-up');
  });

  // Hero animations on load
  const heroFades = document.querySelectorAll('.hero .fade-up');
  setTimeout(() => {
    heroFades.forEach(el => el.classList.add('visible'));
  }, 200);

  // Observer for rest
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = [...el.parentElement.children].filter(c => c.classList.contains('fade-up'));
        const idx = siblings.indexOf(el);
        setTimeout(() => {
          el.classList.add('visible');
        }, idx * 80);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ── Parallax Hero ────────────────────────────────
function initParallax() {
  const heroImg = document.getElementById('hero-parallax');
  if (!heroImg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Only on non-touch devices
  if ('ontouchstart' in window) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const rate = scrolled * 0.3;
    heroImg.style.transform = `scale(1.08) translateY(${rate}px)`;
  }, { passive: true });
}

// ── 3D Tilt Cards ────────────────────────────────
function initTiltCards() {
  if ('ontouchstart' in window) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltX = y * -10;
      const tiltY = x * 10;

      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ── Lightbox ─────────────────────────────────────
function initLightbox() {
  const lightbox   = document.getElementById('lightbox');
  const imgEl      = document.getElementById('lightbox-img');
  const captionEl  = document.getElementById('lightbox-caption');
  const closeBtn   = document.getElementById('lightbox-close');
  const prevBtn    = document.getElementById('lightbox-prev');
  const nextBtn    = document.getElementById('lightbox-next');

  const show = (index) => {
    currentLightboxIndex = (index + galleryImages.length) % galleryImages.length;
    const img = galleryImages[currentLightboxIndex];
    imgEl.src = img.src;
    imgEl.alt = img.alt;
    captionEl.textContent = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    imgEl.src = '';
  };

  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => show(currentLightboxIndex - 1));
  nextBtn?.addEventListener('click', () => show(currentLightboxIndex + 1));

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(currentLightboxIndex - 1);
    if (e.key === 'ArrowRight') show(currentLightboxIndex + 1);
  });

  // Make gallery items keyboard accessible
  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        show(i);
      }
    });
  });

  // Expose globally for onclick in HTML
  window.openLightbox = show;
}

// ── Reviews Slider ───────────────────────────────
function initReviewsSlider() {
  const track     = document.getElementById('reviews-track');
  const prevBtn   = document.getElementById('review-prev');
  const nextBtn   = document.getElementById('review-next');
  if (!track) return;

  const cards = track.querySelectorAll('.review-card');
  const total = cards.length;
  let offset = 0;
  const getVisible = () => {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 900) return 2;
    return 4;
  };

  const update = () => {
    const visible = getVisible();
    const maxOffset = Math.max(0, total - visible);
    if (offset > maxOffset) offset = maxOffset;
    const pct = (100 / visible) * offset;
    track.style.transform = `translateX(-${pct}%)`;
  };

  prevBtn?.addEventListener('click', () => { offset = Math.max(0, offset - 1); update(); });
  nextBtn?.addEventListener('click', () => {
    const visible = getVisible();
    offset = Math.min(total - visible, offset + 1);
    update();
  });

  window.addEventListener('resize', update, { passive: true });
}

// ── Enquiry Form ─────────────────────────────────
function initForm() {
  const form    = document.getElementById('enquiry-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name  = document.getElementById('f-name').value.trim();
    const phone = document.getElementById('f-phone').value.trim();

    if (!name) {
      alert('Please enter your full name.');
      document.getElementById('f-name').focus();
      return;
    }

    if (!phone || phone.length < 7) {
      alert('Please enter a valid phone number.');
      document.getElementById('f-phone').focus();
      return;
    }

    // Simulate form submission
    const submitBtn = document.getElementById('form-submit-btn');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      success.style.display = 'block';
      form.reset();
      submitBtn.textContent = 'Send Enquiry →';
      submitBtn.disabled = false;

      setTimeout(() => {
        success.style.display = 'none';
      }, 6000);
    }, 1200);
  });
}

// ── Back To Top ──────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Smooth Scroll ────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ── Set Default Dates ────────────────────────────
function initAvailabilityDates() {
  const checkin  = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  const fCheckin  = document.getElementById('f-checkin');
  const fCheckout = document.getElementById('f-checkout');

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const fmt = (d) => d.toISOString().split('T')[0];

  if (checkin)  { checkin.min = fmt(today);    checkin.value  = fmt(today);    }
  if (checkout) { checkout.min = fmt(tomorrow); checkout.value = fmt(tomorrow); }
  if (fCheckin)  { fCheckin.min  = fmt(today);    fCheckin.value  = fmt(today);    }
  if (fCheckout) { fCheckout.min = fmt(tomorrow); fCheckout.value = fmt(tomorrow); }

  // Link hero dates to form
  checkin?.addEventListener('change', () => {
    if (fCheckin) fCheckin.value = checkin.value;
    const next = new Date(checkin.value);
    next.setDate(next.getDate() + 1);
    if (checkout) { checkout.min = fmt(next); if (checkout.value <= checkin.value) checkout.value = fmt(next); }
    if (fCheckout) { fCheckout.min = fmt(next); if (fCheckout.value <= checkin.value) fCheckout.value = fmt(next); }
  });

  checkout?.addEventListener('change', () => {
    if (fCheckout) fCheckout.value = checkout.value;
  });
}

// ── Check Availability (scroll to form) ──────────
function checkAvailability() {
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    const top = contactSection.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

// Expose for HTML onclick
window.checkAvailability = checkAvailability;
