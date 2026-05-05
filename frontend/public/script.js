/* ============================================
   MORNINGJUICE – COMPLETE JAVASCRIPT
   ============================================ */

'use strict';

/* ---- DATA ---- */
const JUICES = [
  {
    emoji: '🍊',
    name: 'Sunrise Orange',
    desc: 'Fresh orange, ginger & a touch of turmeric. Your morning immunity shot in a bottle.',
    tags: ['Immunity', 'Detox'],
    tagClasses: ['tag-orange', 'tag-green'],
    filter: ['immunity', 'detox'],
    headerBg: '#fff3e0'
  },
  {
    emoji: '🥬',
    name: 'Green Detox',
    desc: 'Spinach, cucumber, mint & lemon. Flush out toxins and start fresh every single morning.',
    tags: ['Detox', 'Energy'],
    tagClasses: ['tag-green', 'tag-yellow'],
    filter: ['detox', 'energy'],
    headerBg: 'rgba(82,183,136,0.15)'
  },
  {
    emoji: '🍎',
    name: 'Red Power',
    desc: 'Apple, beetroot, carrot & ginger. Packed with iron and natural energy — no caffeine needed.',
    tags: ['Energy', 'Immunity'],
    tagClasses: ['tag-red', 'tag-orange'],
    filter: ['energy', 'immunity'],
    headerBg: 'rgba(239,68,68,0.12)'
  },
  {
    emoji: '🍍',
    name: 'Tropical Glow',
    desc: 'Pineapple, mango, coconut water & lime. Radiant skin starts from the inside out.',
    tags: ['Skin Glow', 'Immunity'],
    tagClasses: ['tag-yellow', 'tag-orange'],
    filter: ['glow', 'immunity'],
    headerBg: 'rgba(249,199,79,0.15)'
  },
  {
    emoji: '🍇',
    name: 'Antioxidant Grape',
    desc: 'Black grapes, pomegranate & lemon. Rich in resveratrol and antioxidants for heart health.',
    tags: ['Immunity', 'Detox'],
    tagClasses: ['tag-purple', 'tag-green'],
    filter: ['immunity', 'detox'],
    headerBg: 'rgba(139,92,246,0.12)'
  },
  {
    emoji: '🥥',
    name: 'Coconut Cool',
    desc: 'Fresh coconut water, mint & cucumber. Pure hydration — nature\'s sports drink, reimagined.',
    tags: ['Detox', 'Energy'],
    tagClasses: ['tag-blue', 'tag-yellow'],
    filter: ['detox', 'energy'],
    headerBg: 'rgba(59,130,246,0.1)'
  },
  {
    emoji: '🫚',
    name: 'Golden Heal',
    desc: 'Turmeric, black pepper, ginger & orange. Anti-inflammatory powerhouse, daily healing ritual.',
    tags: ['Immunity', 'Glow'],
    tagClasses: ['tag-yellow', 'tag-orange'],
    filter: ['immunity', 'glow'],
    headerBg: 'rgba(234,179,8,0.15)'
  },
  {
    emoji: '🍋',
    name: 'Lemon Zing',
    desc: 'Lemon, cucumber, mint & a pinch of pink salt. Alkalizing, hydrating, refreshing.',
    tags: ['Detox', 'Skin Glow'],
    tagClasses: ['tag-yellow', 'tag-green'],
    filter: ['detox', 'glow'],
    headerBg: 'rgba(250,204,21,0.12)'
  }
];

const PLANS_DATA = [
  {
    emoji: '🌱',
    name: 'Weekly',
    duration: '7-day subscription',
    price1: 9,
    price2: 1199,
    perDay1: 1,
    perDay2: 171,
    featured: false,
    perks: [
      '1 fresh juice bottle daily',
      'Choose from 8 blends',
      'Morning delivery by 8 AM',
      'Pause anytime via WhatsApp',
      'Eco-friendly glass bottle'
    ]
  },
  {
    emoji: '🌿',
    name: '10-Day',
    duration: '10-day subscription',
    price1: 899,
    price2: 1499,
    perDay1: 89,
    perDay2: 149,
    featured: true,
    perks: [
      '1 fresh juice bottle daily',
      'Choose from 8 blends',
      'Morning delivery by 7:30 AM',
      'Free daily variety rotation',
      'Priority delivery slot',
      'Eco-friendly glass bottle',
      'Save ₹100 vs weekly'
    ]
  },
  {
    emoji: '🌳',
    name: 'Monthly',
    duration: '30-day subscription',
    price1: 2399,
    price2: 3999,
    perDay1: 79,
    perDay2: 133,
    featured: false,
    perks: [
      '1 fresh juice bottle daily',
      'All 8 blends + seasonal specials',
      'Morning delivery by 7 AM',
      'Free juice customization',
      'Dedicated delivery executive',
      'Monthly wellness report',
      'Referral bonus credits',
      'Best value — save ₹570'
    ]
  }
];

const TESTIMONIALS = [
  {
    initials: 'PR',
    name: 'Priya Rao',
    role: 'Software Engineer, Andheri',
    stars: 5,
    text: '"MorningJuice changed my mornings completely. The Green Detox arrives fresh every day and I genuinely feel the difference in my energy levels. Absolutely love it!"'
  },
  {
    initials: 'AM',
    name: 'Aakash Mehta',
    role: 'Business Owner, Bandra',
    stars: 5,
    text: '"The monthly plan is incredible value. My whole family — wife, kids, even my parents — all get their juice every morning. The Red Power is our family favourite!"'
  },
  {
    initials: 'NK',
    name: 'Neha Kulkarni',
    role: 'Fitness Trainer, Powai',
    stars: 5,
    text: '"As a fitness trainer, I recommend MorningJuice to all my clients. No preservatives, no sugar, pure cold-pressed nutrition. Delivery is always on time — never had a miss!"'
  },
  {
    initials: 'RS',
    name: 'Rahul Sharma',
    role: 'Startup Founder, Juhu',
    stars: 5,
    text: '"I\'ve been on the 10-day plan for 3 months now. The Sunrise Orange is perfect for busy mornings. Brilliant quality, super fresh, and the team is very responsive on WhatsApp."'
  },
  {
    initials: 'DK',
    name: 'Divya Kapoor',
    role: 'Doctor, Versova',
    stars: 5,
    text: '"I specifically appreciate zero preservatives and local sourcing. As a doctor, I feel confident recommending MorningJuice. The Golden Heal blend has turmeric — brilliant."'
  },
  {
    initials: 'VJ',
    name: 'Vikram Joshi',
    role: 'Retired Executive, Malad',
    stars: 5,
    text: '"My wife and I subscribed to the monthly plan. Delivered before 7 AM without fail. Packaging is eco-friendly too. This is exactly how morning wellness should work."'
  }
];

const FAQS = [
  {
    q: 'What time will my juice be delivered?',
    a: 'All deliveries happen between 6:00 AM and 8:00 AM. Monthly subscribers get priority slots (before 7 AM). We guarantee your juice arrives before you leave for work.'
  },
  {
    q: 'Can I pause or cancel my subscription?',
    a: 'Absolutely. Just send us a WhatsApp message at least 24 hours before your next delivery. You can pause for travel, skip a day, or cancel anytime — no lock-in, no hassle.'
  },
  {
    q: 'Are the juices really made fresh every day?',
    a: 'Yes! Every single bottle is cold-pressed the same morning of delivery. We source fruits & vegetables from local vendors at dawn, then press and pack immediately — no cold storage, no day-old stock.'
  },
  {
    q: 'What areas in Mumbai do you currently deliver to?',
    a: 'We currently deliver across Andheri, Bandra, Juhu, Versova, Malad, Goregaon, Powai, and surrounding areas. Send us a WhatsApp message with your pincode to confirm availability.'
  },
  {
    q: 'Can I change my juice selection mid-subscription?',
    a: 'Yes! WhatsApp us the night before and we\'ll swap your juice for the next morning. Monthly subscribers can change their blend anytime.'
  },
  {
    q: 'Do you use any sugar, additives, or preservatives?',
    a: 'Never. Our juices contain zero sugar, zero preservatives, and zero artificial additives. Just pure fruits and vegetables — cold-pressed to retain maximum nutrients.'
  },
  {
    q: 'How do I pay for my subscription?',
    a: 'We accept UPI (GPay, PhonePe, Paytm), bank transfer, and cash on first delivery. You pre-pay for your plan duration at the start of each cycle.'
  },
  {
    q: 'What is your bottle/packaging policy?',
    a: 'We use eco-friendly, reusable glass bottles. Our delivery executive collects the previous day\'s empty bottle during each morning delivery — no waste, fully sustainable.'
  }
];

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  initAnnouncementBar();
  initNavbar();
  initHero();
  renderJuices();
  initJuiceFilter();
  renderPlans();
  renderTestimonials();
  initTestiSlider();
  renderFAQ();
  initModal();
  initSubscribeForm();
  initBackToTop();
  initScrollAnimations();
  initCounters();
  initPlanToggle();
});

/* ---- ANNOUNCEMENT BAR ---- */
function initAnnouncementBar() {
  const bar = document.querySelector('.announcement-bar');
  const btn = document.getElementById('annClose');
  if (!btn || !bar) return;
  btn.addEventListener('click', () => {
    bar.style.maxHeight = bar.offsetHeight + 'px';
    bar.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      bar.style.transition = 'max-height 0.4s ease, opacity 0.3s';
      bar.style.maxHeight = '0';
      bar.style.opacity = '0';
    });
    setTimeout(() => bar.remove(), 400);
  });
}

/* ---- NAVBAR ---- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---- HERO ---- */
function initHero() {
  // Parallax on orb
  const orb = document.querySelector('.juice-orb');
  if (!orb) return;
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    orb.style.transform = `translate(${dx * 12}px, ${dy * 12}px)`;
  });
}

/* ---- RENDER JUICES ---- */
function renderJuices(filter = 'all') {
  const grid = document.getElementById('juiceGrid');
  if (!grid) return;
  grid.innerHTML = '';
  JUICES.forEach((j, i) => {
    const hidden = filter !== 'all' && !j.filter.includes(filter);
    const card = document.createElement('div');
    card.className = 'juice-card' + (hidden ? ' hidden' : '');
    card.style.animationDelay = (i * 0.07) + 's';
    card.innerHTML = `
      <div class="juice-card-header" style="background: ${j.headerBg};">
        <span>${j.emoji}</span>
      </div>
      <div class="juice-card-body">
        <h3>${j.name}</h3>
        <p class="desc">${j.desc}</p>
        <div class="juice-tags">
          ${j.tags.map((t, ti) => `<span class="juice-tag ${j.tagClasses[ti]}">${t}</span>`).join('')}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ---- JUICE FILTER ---- */
function initJuiceFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      renderJuices(filter);
    });
  });
}

/* ---- RENDER PLANS ---- */
let familyMode = false;
function renderPlans() {
  const grid = document.getElementById('plansGrid');
  if (!grid) return;
  grid.innerHTML = '';
  PLANS_DATA.forEach(plan => {
    const price = familyMode ? plan.price2 : plan.price1;
    const perDay = familyMode ? plan.perDay2 : plan.perDay1;
    const saving = familyMode ? ' — Family Deal!' : (plan.name === '10-Day' ? ' — Save ₹100!' : plan.name === 'Monthly' ? ' — Best Value!' : '');

    const card = document.createElement('div');
    card.className = 'plan-card' + (plan.featured ? ' featured' : '');
    card.innerHTML = `
      ${plan.featured ? '<div class="plan-featured-badge">⭐ Most Popular</div>' : ''}
      <span class="plan-emoji">${plan.emoji}</span>
      <div class="plan-name">${plan.name}</div>
      <div class="plan-duration">${plan.duration}${familyMode ? ' · 2 bottles/day' : ''}</div>
      <div class="plan-price-block">
        <div class="plan-price">
          <span class="amount">₹${price.toLocaleString('en-IN')}</span>
          <span class="per">/${plan.name === 'Weekly' ? 'week' : plan.name === '10-Day' ? '10 days' : 'month'}</span>
        </div>
      </div>
      <div class="plan-per-day">Just ₹${perDay}/day${saving}</div>
      <div class="plan-perks">
        ${plan.perks.map(p => `<div class="plan-perk"><div class="perk-check">✓</div><span>${p}</span></div>`).join('')}
      </div>
      <button class="${plan.featured ? 'plan-btn-filled' : 'plan-btn-outline'}" onclick="openModal('${plan.name} – ₹${price.toLocaleString('en-IN')}')">
        Get Started ${plan.featured ? '🚀' : ''}
      </button>
    `;
    grid.appendChild(card);
  });
}

/* ---- PLAN TOGGLE ---- */
function initPlanToggle() {
  const toggle = document.getElementById('planToggle');
  if (!toggle) return;
  toggle.addEventListener('change', () => {
    familyMode = toggle.checked;
    renderPlans();
  });
}

/* ---- RENDER TESTIMONIALS ---- */
function renderTestimonials() {
  const track = document.getElementById('testiTrack');
  const dots = document.getElementById('testiDots');
  if (!track || !dots) return;

  track.innerHTML = TESTIMONIALS.map(t => `
    <div class="testi-card">
      <div class="testi-stars">${'★'.repeat(t.stars)}</div>
      <p class="testi-text">${t.text}</p>
      <div class="testi-author">
        <div class="testi-avatar">${t.initials}</div>
        <div>
          <div class="testi-name">${t.name}</div>
          <div class="testi-role">${t.role}</div>
        </div>
      </div>
    </div>
  `).join('');

  const totalSlides = TESTIMONIALS.length;
  dots.innerHTML = Array.from({ length: totalSlides }, (_, i) =>
    `<div class="dot${i === 0 ? ' active' : ''}" data-index="${i}"></div>`
  ).join('');

  dots.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => slideTo(parseInt(dot.dataset.index)));
  });
}

/* ---- TESTI SLIDER ---- */
function initTestiSlider() {
  const track = document.getElementById('testiTrack');
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  if (!track || !prev || !next) return;

  let current = 0;
  let perView = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
  const total = TESTIMONIALS.length;

  function getMax() { return Math.max(0, total - perView); }

  window.slideTo = function(index) {
    current = Math.max(0, Math.min(index, getMax()));
    const cardWidth = track.children[0] ? track.children[0].offsetWidth + 24 : 0;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  };

  prev.addEventListener('click', () => slideTo(current - 1));
  next.addEventListener('click', () => slideTo(current + 1));

  // Auto-slide
  let autoTimer = setInterval(() => slideTo((current + 1) % (getMax() + 1)), 4000);
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => slideTo((current + 1) % (getMax() + 1)), 4000);
  });

  window.addEventListener('resize', () => {
    perView = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
    slideTo(0);
  });
}

/* ---- RENDER FAQ ---- */
function renderFAQ() {
  const list = document.getElementById('faqList');
  if (!list) return;
  list.innerHTML = FAQS.map((f, i) => `
    <div class="faq-item">
      <button class="faq-question" data-index="${i}">
        <span class="faq-q-text">${f.q}</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer"><p>${f.a}</p></div>
    </div>
  `).join('');

  list.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      list.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ---- MODAL ---- */
window.openModal = function(planName) {
  const overlay = document.getElementById('modalOverlay');
  const planNameEl = document.getElementById('modalPlanName');
  const fpPlan = document.getElementById('fplan');
  if (!overlay) return;
  if (planNameEl) planNameEl.textContent = planName || '';
  if (fpPlan) {
    const planKey = planName && planName.toLowerCase().includes('weekly') ? 'weekly'
      : planName && planName.toLowerCase().includes('10') ? '10day'
      : 'monthly';
    fpPlan.value = planKey;
  }
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const form = document.getElementById('modalForm');
  if (!overlay) return;

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn && closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('mname').value;
    const phone = document.getElementById('mphone').value;
    const address = document.getElementById('maddress').value;
    const juice = document.getElementById('mjuice').value;
    const plan = document.getElementById('modalPlanName').textContent;

    const msg = `Hi MorningJuice! 🥤\n\nNew Subscription Request:\n━━━━━━━━━━━━━━\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nJuice: ${juice}\nPlan: ${plan}\n━━━━━━━━━━━━━━\nPlease confirm my subscription!`;
    const url = `https://wa.me/919999999999?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    closeModal();
    showToast('🎉 Redirecting to WhatsApp to confirm!');
    form.reset();
  });
}

/* ---- CONTACT / SUBSCRIBE FORM ---- */
function initSubscribeForm() {
  const form = document.getElementById('subscribeForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fname').value;
    const phone = document.getElementById('fphone').value;
    const address = document.getElementById('faddress').value;
    const plan = document.getElementById('fplan');
    const juice = document.getElementById('fjuice').value;
    const planText = plan ? plan.options[plan.selectedIndex].text : '';

    const msg = `Hi MorningJuice! 🥤\n\nNew Subscription Request:\n━━━━━━━━━━━━━━\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nJuice: ${juice}\nPlan: ${planText}\n━━━━━━━━━━━━━━\nPlease confirm my subscription!`;
    const url = `https://wa.me/919999999999?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    showToast('🎉 Redirecting to WhatsApp to confirm your order!');
    form.reset();
  });
}

/* ---- BACK TO TOP ---- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- SCROLL ANIMATIONS ---- */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

  // Stagger step cards, why cards, plan cards
  const staggerTargets = document.querySelectorAll('.step-card, .why-card, .plan-card, .juice-card, .faq-item');
  const staggerObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (i * 0.07) + 's';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        staggerObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  staggerTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    staggerObs.observe(el);
  });
}

/* ---- COUNTERS ---- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let start = 0;
        const duration = 1500;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { el.textContent = target; clearInterval(timer); }
          else el.textContent = Math.floor(start);
        }, 16);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}

/* ---- TOAST ---- */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ---- SMOOTH SCROLL FOR ALL ANCHOR LINKS ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
