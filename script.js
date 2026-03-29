/**
 * ================================================================
 * FAJARDEV STUDIO — Landing Page JavaScript
 * Brand: FajarDev Studio | Founder: Fajar Yoga Borneo
 *
 * Fitur:
 *  1. Navbar scroll effect & active link highlight
 *  2. Hamburger mobile menu (drawer)
 *  3. Scroll reveal animations (IntersectionObserver)
 *  4. Hero fade-up animation on load
 *  5. Progress bar animation (hero visual card)
 *  6. Form validation & simulated submission
 *  7. Smooth scroll (polyfill untuk anchor links)
 *  8. Back-to-top (built into #home scroll)
 * ================================================================
 */

'use strict';

/* ================================================================
   1. NAVBAR — Scroll effect & active section tracking
   ================================================================ */
const navbar    = document.getElementById('navbar');
const allLinks  = document.querySelectorAll('.nav-link, .drawer-link');
const sections  = document.querySelectorAll('section[id]');

/**
 * Tambahkan class .scrolled saat halaman di-scroll > 60px
 */
function onScroll() {
  // Scrolled state
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight active nav link
  let current = '';
  sections.forEach(sec => {
    const offset = sec.offsetTop - navbar.offsetHeight - 80;
    if (window.scrollY >= offset) {
      current = sec.getAttribute('id');
    }
  });

  allLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // Jalankan sekali saat load


/* ================================================================
   2. HAMBURGER MENU — Mobile drawer toggle
   ================================================================ */
const hamburger = document.getElementById('hamburger');
const navDrawer = document.getElementById('navDrawer');
const drawerLinks = document.querySelectorAll('.drawer-link');

/**
 * Buka / tutup mobile drawer
 */
function toggleDrawer(forceClose = false) {
  const isOpen = navDrawer.classList.contains('open') || forceClose;

  if (isOpen) {
    // Tutup
    hamburger.classList.remove('open');
    navDrawer.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    // Buka
    hamburger.classList.add('open');
    navDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

hamburger.addEventListener('click', () => toggleDrawer());

// Tutup drawer saat klik menu item
drawerLinks.forEach(link => {
  link.addEventListener('click', () => toggleDrawer(true));
});

// Tutup drawer saat klik di luar navbar
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navDrawer.classList.contains('open')) {
    toggleDrawer(true);
  }
});

// Tutup drawer saat resize ke desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 960 && navDrawer.classList.contains('open')) {
    toggleDrawer(true);
  }
});


/* ================================================================
   3. SCROLL REVEAL — IntersectionObserver
   ================================================================ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Hitung delay berdasarkan posisi dalam parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx      = siblings.indexOf(entry.target);
      const delay    = Math.min(idx * 90, 400); // max 400ms

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold:  0.1,
    rootMargin: '0px 0px -50px 0px',
  }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ================================================================
   4. HERO FADE-UP — Stagger on page load
   ================================================================ */
window.addEventListener('load', () => {
  const heroFadeEls = document.querySelectorAll('.fade-up');

  heroFadeEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 150 + i * 120);
  });

  // Animasi progress bar di visual card
  animateBars();
});


/* ================================================================
   5. HERO VISUAL BARS — Animate progress bars
   ================================================================ */
/**
 * Menggantikan vc-bar pseudo-element dengan struktur yang lebih
 * animatable via JavaScript.
 */
function animateBars() {
  // Replace static vc-bar with JS-powered version
  const vcBody = document.querySelector('.vc-body');
  if (!vcBody) return;

  const bars = [
    { label: 'Web Dev',    value: 90, color: 'var(--grad-primary)' },
    { label: 'UI/UX',      value: 78, color: 'linear-gradient(135deg,#8B5CF6,#EC4899)' },
    { label: 'Marketing',  value: 65, color: 'linear-gradient(135deg,#06B6D4,#10B981)' },
  ];

  vcBody.innerHTML = bars.map(bar => `
    <div class="vc-bar-item">
      <div class="vc-bar-row">
        <span>${bar.label}</span>
        <em>${bar.value}%</em>
      </div>
      <div class="vc-bar-track">
        <div class="vc-bar-fill"
             style="background:${bar.color}; --target:${bar.value}%"></div>
      </div>
    </div>
  `).join('');

  // Trigger width animations after a short delay
  setTimeout(() => {
    document.querySelectorAll('.vc-bar-fill').forEach(fill => {
      fill.style.width = fill.style.getPropertyValue('--target') || '0%';
    });
  }, 600);
}


/* ================================================================
   6. SMOOTH SCROLL — Override default anchor scroll
   ================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href   = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const navH   = navbar.offsetHeight;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH - 8;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ================================================================
   7. FORM VALIDATION & SUBMISSION
   ================================================================ */
const contactForm   = document.getElementById('contactForm');
const formSubmit    = document.getElementById('formSubmit');
const formSuccess   = document.getElementById('formSuccess');

// Field references
const fields = {
  fname:    { el: document.getElementById('fname'),    err: document.getElementById('fnameErr')    },
  femail:   { el: document.getElementById('femail'),   err: document.getElementById('femailErr')   },
  fmessage: { el: document.getElementById('fmessage'), err: document.getElementById('fmessageErr') },
};

/**
 * Validasi email sederhana
 * @param {string} val
 * @returns {boolean}
 */
function isEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

/**
 * Tampilkan pesan error pada field
 * @param {HTMLElement} el    - Input element
 * @param {HTMLElement} errEl - Error span
 * @param {string}      msg   - Pesan error
 */
function setError(el, errEl, msg) {
  el.classList.add('is-error');
  errEl.textContent = msg;
}

/**
 * Hapus pesan error pada field
 * @param {HTMLElement} el    - Input element
 * @param {HTMLElement} errEl - Error span
 */
function clearError(el, errEl) {
  el.classList.remove('is-error');
  errEl.textContent = '';
}

/**
 * Jalankan validasi seluruh form
 * @returns {boolean} true jika semua field valid
 */
function validateAll() {
  let ok = true;

  // Nama: min 2 karakter
  const fname = fields.fname.el.value.trim();
  if (fname.length < 2) {
    setError(fields.fname.el, fields.fname.err, 'Nama minimal 2 karakter.');
    ok = false;
  } else {
    clearError(fields.fname.el, fields.fname.err);
  }

  // Email: format valid
  const femail = fields.femail.el.value.trim();
  if (!femail) {
    setError(fields.femail.el, fields.femail.err, 'Email tidak boleh kosong.');
    ok = false;
  } else if (!isEmail(femail)) {
    setError(fields.femail.el, fields.femail.err, 'Format email tidak valid.');
    ok = false;
  } else {
    clearError(fields.femail.el, fields.femail.err);
  }

  // Pesan: min 15 karakter
  const fmessage = fields.fmessage.el.value.trim();
  if (fmessage.length < 15) {
    setError(fields.fmessage.el, fields.fmessage.err, 'Pesan minimal 15 karakter.');
    ok = false;
  } else {
    clearError(fields.fmessage.el, fields.fmessage.err);
  }

  return ok;
}

// Live validation saat mengetik
Object.values(fields).forEach(({ el, err }) => {
  el.addEventListener('input', () => {
    // Hanya hapus error jika sudah ada, jangan trigger error baru
    if (el.classList.contains('is-error')) {
      if (el.id === 'femail' && isEmail(el.value.trim())) clearError(el, err);
      else if (el.value.trim().length >= (el.tagName === 'TEXTAREA' ? 15 : 2)) clearError(el, err);
    }
  });
});

/**
 * Handle form submit
 * Simulasi pengiriman (tanpa backend sungguhan)
 */
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validasi terlebih dahulu
    if (!validateAll()) return;

    // Loading state
    formSubmit.classList.add('loading');
    formSubmit.disabled = true;
    formSuccess.classList.remove('visible');

    // Simulasi delay pengiriman (1.5 detik)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Reset & tampilkan sukses
    contactForm.reset();
    formSubmit.classList.remove('loading');
    formSubmit.disabled = false;
    formSuccess.classList.add('visible');

    // Sembunyikan pesan sukses setelah 6 detik
    setTimeout(() => {
      formSuccess.classList.remove('visible');
    }, 6000);
  });
}


/* ================================================================
   8. COUNTER ANIMATION — Hero metrics
   ================================================================ */
const metricStrongs = document.querySelectorAll('.metric strong');

/**
 * Animasikan angka dari 0 ke target dalam durasi tertentu
 * @param {HTMLElement} el       - Element yang menampilkan angka
 * @param {number}      target   - Nilai akhir angka
 * @param {string}      suffix   - Suffix (contoh: '+', '%')
 * @param {number}      duration - Durasi animasi (ms)
 */
function animateCounter(el, target, suffix, duration = 1200) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed  = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing: ease-out-quart
    const eased  = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(eased * target);

    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + suffix; // Pastikan nilai akhir tepat
    }
  }

  requestAnimationFrame(step);
}

// Observer untuk counter
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el      = entry.target;
      const text    = el.textContent.trim();
      const numMatch = text.match(/[\d,]+/);

      if (numMatch) {
        const numStr = numMatch[0].replace(',', '');
        const target = parseInt(numStr, 10);
        const suffix = text.replace(numMatch[0], '');
        animateCounter(el, target, suffix);
      }

      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.7 }
);

metricStrongs.forEach(el => counterObserver.observe(el));


/* ================================================================
   9. FLOATING BADGE INTERACTION — Hero visual
   ================================================================ */
// Tambahkan parallax ringan pada mouse move di hero
const heroSection = document.querySelector('.hero');
const heroVisual  = document.querySelector('.hero-visual');

if (heroSection && heroVisual && window.innerWidth > 960) {
  heroSection.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = heroSection.getBoundingClientRect();
    const cx = (e.clientX - left) / width  - 0.5;  // -0.5 to 0.5
    const cy = (e.clientY - top)  / height - 0.5;

    heroVisual.style.transform = `translate(${cx * 12}px, ${cy * 8}px)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    heroVisual.style.transform = '';
  });
}


/* ================================================================
   10. CONSOLE BRANDING
   ================================================================ */
console.log(
  '%c FajarDev Studio ',
  'background: linear-gradient(135deg,#4F46E5,#06B6D4); color: white; font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 4px;'
);
console.log(
  '%cFajar Yoga Borneo — Web Development Practice Project\nhttps://github.com/fajaryogaborneo',
  'color: #6366F1; font-size: 11px;'
);
