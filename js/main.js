/**
 * ARKSTONE & CO. — Ultra Luxury Jewellery
 * main.js — All interactive features
 */

'use strict';

/* ============================================================
   1. PAGE LOADER
   ============================================================ */
(function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // Hide after animation completes
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      // Trigger hero reveals
      document.querySelectorAll('.hero-section .reveal-up').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 200);
      });
    }, 2000);
  });

  // Prevent scroll during load
  document.body.style.overflow = 'hidden';
})();

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const diamond = document.getElementById('cursor-diamond');
  const trail = document.getElementById('cursor-trail');
  if (!diamond || !trail) return;
  if (window.innerWidth < 768) return;

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    diamond.style.left = mouseX + 'px';
    diamond.style.top = mouseY + 'px';
  });

  // Smooth trail
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    if (trail) {
      trail.style.left = trailX + 'px';
      trail.style.top = trailY + 'px';
    }
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Light background detector
  document.addEventListener('mouseover', (e) => {
    let el = e.target;
    let isLight = false;
    while (el) {
      const bg = window.getComputedStyle(el).backgroundColor;
      const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

        if (a > 0.1) {
          // Calculate relative luminance / brightness
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          if (brightness > 180) {
            isLight = true;
          }
          break; // Stop climbing if we hit any visible solid color
        }
      }
      if (el === document.body) break;
      el = el.parentElement;
    }
    if (isLight) {
      diamond.classList.add('cursor-black');
    } else {
      diamond.classList.remove('cursor-black');
    }
  });

  // Hover scale
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      diamond.style.transform = 'translate(-50%,-50%) scale(1.6)';
      trail.style.transform = 'translate(-50%,-50%) scale(1.5)';
      trail.style.borderColor = 'rgba(201,168,76,0.7)';
    });
    el.addEventListener('mouseleave', () => {
      diamond.style.transform = 'translate(-50%,-50%) scale(1)';
      trail.style.transform = 'translate(-50%,-50%) scale(1)';
      trail.style.borderColor = 'rgba(201,168,76,0.4)';
    });
  });
})();

/* ============================================================
   3. SCROLL PROGRESS BAR
   ============================================================ */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
})();

/* ============================================================
   4. NAVBAR SCROLL GLASS EFFECT
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu
  function openMenu() {
    mobileOverlay.classList.add('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileOverlay.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileMenuBtn?.addEventListener('click', openMenu);
  mobileCloseBtn?.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
  mobileOverlay?.addEventListener('click', (e) => { if (e.target === mobileOverlay) closeMenu(); });
})();

/* ============================================================
   5. GOLD PARTICLE CANVAS ANIMATION (HERO)
   ============================================================ */
(function initParticleCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4 - 0.2;
      this.opacity = Math.random() * 0.7 + 0.1;
      this.shimmer = Math.random() * Math.PI * 2;
      this.shimmerSpeed = Math.random() * 0.02 + 0.01;
      // Gold color variants
      const hue = 38 + (Math.random() - 0.5) * 20;
      const sat = 65 + Math.random() * 25;
      const light = 55 + Math.random() * 25;
      this.color = `hsl(${hue},${sat}%,${light}%)`;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.shimmer += this.shimmerSpeed;
      this.opacity = 0.3 + Math.abs(Math.sin(this.shimmer)) * 0.6;
      if (this.y < -10 || this.x < -10 || this.x > w + 10) this.reset(), this.y = h + 5;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      // Diamond shape particles
      if (this.size > 1.4) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size * 1.5);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.lineTo(this.x, this.y + this.size * 1.5);
        ctx.lineTo(this.x - this.size, this.y);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((w * h) / 8000), 120);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();
  window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });
})();

/* ============================================================
   6. REVEAL ON SCROLL (IntersectionObserver)
   ============================================================ */
(function initRevealOnScroll() {
  const elements = document.querySelectorAll('.reveal-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Respect animation-delay if set inline
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => {
    // Skip hero elements (handled by loader)
    if (!el.closest('.hero-section')) {
      observer.observe(el);
    }
  });
})();

/* ============================================================
   7. STATS COUNTER ANIMATION
   ============================================================ */
(function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number:not(.stat-text)');
  if (!statNumbers.length) return;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2200;
    const startTime = performance.now();
    const startVal = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.floor(startVal + (target - startVal) * easedProgress);
      el.textContent = current.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
})();

/* ============================================================
   8. PRODUCT FILTER TABS
   ============================================================ */
(function initProductFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.product-card');
  if (!tabs.length || !cards.length) return;

  function filterProducts(filter) {
    cards.forEach(card => {
      const cat = card.dataset.category;
      const show = filter === 'all' || cat === filter;
      
      if (show) {
        card.classList.remove('hidden');
        // Stagger reveal
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          card.style.opacity = '';
          card.style.transform = '';
        }, 50);
      } else {
        card.classList.add('hidden');
        card.style.opacity = '';
        card.style.transform = '';
        card.style.transition = '';
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      // Update active tab
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      filterProducts(filter);
    });
  });
})();

/* ============================================================
   9. WISHLIST TOGGLE
   ============================================================ */
(function initWishlist() {
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isActive = btn.classList.toggle('active');
      const heart = btn.querySelector('.heart-icon');
      if (heart) heart.textContent = isActive ? '♥' : '♡';
      
      const productName = btn.closest('.product-card')?.querySelector('.product-name')?.textContent;
      showToast(
        isActive
          ? `${productName || 'Item'} added to wishlist ♥`
          : `${productName || 'Item'} removed from wishlist`,
        isActive ? 'success' : 'info'
      );
    });
  });
})();

/* ============================================================
   10. TESTIMONIALS AUTO-CAROUSEL
   ============================================================ */
(function initCarousel() {
  const track = document.getElementById('testimonials-track');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (!track) return;

  let current = 0;
  const total = track.children.length;
  let autoTimer = null;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  // Touch / swipe support
  let touchStart = 0;
  track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); startAuto(); }
  }, { passive: true });

  startAuto();
})();

/* ============================================================
   11. MAGNETIC BUTTONS
   ============================================================ */
(function initMagneticButtons() {
  if (window.innerWidth < 768) return;
  const magnetics = document.querySelectorAll('.magnetic-btn');

  magnetics.forEach(btn => {
    let rect;

    btn.addEventListener('mouseenter', () => {
      rect = btn.getBoundingClientRect();
    });

    btn.addEventListener('mousemove', (e) => {
      if (!rect) return;
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.25;
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });
  });
})();

/* ============================================================
   12. FORM VALIDATION + SUCCESS TOAST
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('appointment-form');
  const successMsg = document.getElementById('form-success');
  if (!form) return;

  function validateField(input) {
    const id = input.id;
    const errEl = document.getElementById('error-' + id.replace('form-', ''));
    let valid = true;
    let msg = '';

    input.classList.remove('error');

    if (input.hasAttribute('required') && !input.value.trim()) {
      msg = 'This field is required.';
      valid = false;
    } else if (id === 'form-email' && input.value) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(input.value)) { msg = 'Please enter a valid email.'; valid = false; }
    } else if (id === 'form-phone' && input.value) {
      const re = /^[\+]?[\d\s\-\(\)]{8,15}$/;
      if (!re.test(input.value)) { msg = 'Please enter a valid phone number.'; valid = false; }
    }

    if (!valid) {
      input.classList.add('error');
    }
    if (errEl) errEl.textContent = msg;
    return valid;
  }

  // Live validation
  form.querySelectorAll('input[required], select[required]').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;

    form.querySelectorAll('input[required]').forEach(input => {
      if (!validateField(input)) allValid = false;
    });

    if (!allValid) {
      showToast('Please fill in all required fields correctly.', 'error');
      return;
    }

    // Simulate submission
    const submitBtn = document.getElementById('form-submit-btn');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.opacity = '0';
      form.style.transform = 'translateY(10px)';
      form.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

      setTimeout(() => {
        form.style.display = 'none';
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.style.opacity = '0';
          successMsg.style.transform = 'translateY(10px)';
          requestAnimationFrame(() => {
            successMsg.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            successMsg.style.opacity = '1';
            successMsg.style.transform = 'translateY(0)';
          });
        }
        showToast('Appointment request sent! We\'ll be in touch soon.', 'success');
      }, 500);
    }, 1500);
  });
})();

/* ============================================================
   13. TOAST NOTIFICATION
   ============================================================ */
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = 'toast show toast-' + type;

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ============================================================
   14. SMOOTH ANCHOR LINKS
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   15. SECTION ENTER ANIMATIONS (stagger children)
   ============================================================ */
(function initSectionAnimations() {
  // Stagger grid items
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll('.craft-feature');
        children.forEach((child, i) => {
          child.style.opacity = '0';
          child.style.transform = 'translateX(-20px)';
          setTimeout(() => {
            child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            child.style.opacity = '1';
            child.style.transform = '';
          }, i * 150);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const craftContent = document.querySelector('.craft-content-col');
  if (craftContent) observer.observe(craftContent);
})();

/* ============================================================
   16. GOLD SHIMMER ON PRODUCT CARDS (extra sparkle on hover)
   ============================================================ */
(function initProductCardEffects() {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = `
        0 20px 60px rgba(0,0,0,0.5),
        0 0 0 1px rgba(201,168,76,0.35),
        0 0 30px rgba(201,168,76,0.08)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });
})();

/* ============================================================
   17. PARALLAX EFFECT (subtle on hero elements)
   ============================================================ */
(function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  const heroBokeh = document.querySelector('.bokeh-container');
  if (!heroContent || window.innerWidth < 768) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      const y1 = scrollY * 0.3;
      const y2 = scrollY * 0.15;
      heroContent.style.transform = `translateY(${y1}px)`;
      if (heroBokeh) heroBokeh.style.transform = `translateY(${y2}px)`;
    }
  }, { passive: true });
})();

/* ============================================================
   18. SET MIN DATE FOR APPOINTMENT FORM
   ============================================================ */
(function setMinDate() {
  const dateInput = document.getElementById('form-date');
  if (!dateInput) return;
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
})();

/* ============================================================
   19. IMAGE LAZY LOAD ENHANCEMENT
   ============================================================ */
(function initLazyLoad() {
  if (!('IntersectionObserver' in window)) return;

  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.addEventListener('load', () => {
          entry.target.style.transition = 'opacity 0.6s ease';
          entry.target.style.opacity = '';
        }, { once: true });
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });

  imgs.forEach(img => observer.observe(img));
})();

/* ============================================================
   20. COLLECTION CARD HOVER GLOW
   ============================================================ */
(function initCollectionGlow() {
  const cards = document.querySelectorAll('.collection-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,168,76,0.08)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });
})();

/* ============================================================
   21. IMAGE ERROR FALLBACK (gold gradient placeholder)
   ============================================================ */
(function initImageFallbacks() {
  const FALLBACK_SVG = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#111111"/>
          <stop offset="50%" stop-color="#1a1505"/>
          <stop offset="100%" stop-color="#080808"/>
        </linearGradient>
        <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#C9A84C" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#E8C97A" stop-opacity="0.2"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#g)"/>
      <rect width="800" height="800" fill="url(#g2)" opacity="0.3"/>
      <g transform="translate(400,400)">
        <polygon points="0,-80 70,-20 0,80 -70,-20" fill="#C9A84C" opacity="0.5"/>
        <polygon points="0,-80 70,-20 0,20" fill="#E8C97A" opacity="0.4"/>
        <polygon points="0,20 70,-20 0,80" fill="#A07830" opacity="0.4"/>
      </g>
      <text x="400" y="520" font-family="serif" font-size="18" fill="#C9A84C" opacity="0.4" text-anchor="middle" letter-spacing="8">ARKSTONE &amp; CO.</text>
    </svg>
  `)}`;

  function applyFallback(img) {
    img.onerror = null;
    img.src = FALLBACK_SVG;
    img.style.objectFit = 'cover';
  }

  // Apply to all images on the page
  document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth === 0) {
      applyFallback(img);
    } else if (!img.complete) {
      img.addEventListener('error', () => applyFallback(img), { once: true });
    }
  });

  // Also watch for dynamically added images
  const mo = new MutationObserver(mutations => {
    mutations.forEach(m => m.addedNodes.forEach(n => {
      if (n.tagName === 'IMG') {
        n.addEventListener('error', () => applyFallback(n), { once: true });
      }
    }));
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();

/* ============================================================
   CONSOLE SIGNATURE
   ============================================================ */
console.log(
  '%c✦ ARKSTONE & CO. ✦',
  'font-size:18px;color:#C9A84C;font-family:serif;font-weight:bold;'
);
console.log(
  '%cWhere luxury meets legacy.',
  'font-size:12px;color:#E8C97A;font-style:italic;'
);
