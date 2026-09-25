// ===== Preloader =====
window.addEventListener('load', () => {
  const pre = document.querySelector('.preloader');
  if (pre) setTimeout(() => pre.classList.add('hide'), 500);
});

// ===== Nav scroll state =====
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) nav?.classList.add('scrolled');
  else nav?.classList.remove('scrolled');
});

// ===== Mobile menu =====
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');

const closeMobileMenu = () => {
  burger?.classList.remove('active');
  mobileMenu?.classList.remove('open');
};

burger?.addEventListener('click', () => {
  burger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});
mobileMenuClose?.addEventListener('click', closeMobileMenu);
document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', closeMobileMenu));

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// stagger index
document.querySelectorAll('.stagger').forEach(group => {
  [...group.children].forEach((c, i) => c.style.setProperty('--i', i));
});

// ===== Counters =====
const counters = document.querySelectorAll('.stat-num[data-count]');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; const target = +el.dataset.count; let cur = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const tick = () => { cur += step; if (cur >= target) { el.textContent = target + (el.dataset.suffix || ''); } else { el.textContent = cur + (el.dataset.suffix || ''); requestAnimationFrame(tick); } };
    tick(); cio.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => cio.observe(c));

// ===== Filter tabs (portfolio) =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('[data-cat]');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  galleryItems.forEach(item => {
    const show = f === 'all' || item.dataset.cat === f;
    item.style.transition = 'opacity .4s ease, transform .4s ease';
    if (show) { item.style.display = ''; requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }); }
    else { item.style.opacity = '0'; item.style.transform = 'scale(.92)'; setTimeout(() => item.style.display = 'none', 380); }
  });
}));

// ===== FAQ accordion =====
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null; });
    if (!isOpen) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
  });
});

// ===== Tilt effect =====
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)');
});

// ===== Cursor dot =====
const dot = document.querySelector('.cursor-dot');
if (dot) window.addEventListener('mousemove', e => { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'; });

// ===== Form validation (Indian context) =====
document.querySelectorAll('form[data-validate]').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const name = form.querySelector('[name="name"]');
    const phone = form.querySelector('[name="phone"]');
    const email = form.querySelector('[name="email"]');

    const setErr = (field, msg) => {
      const err = field.parentElement.querySelector('.err');
      if (!err) return;
      err.textContent = msg; err.classList.toggle('show', !!msg);
    };

    if (name) {
      const ok = /^[A-Za-z ]{2,16}$/.test(name.value.trim());
      setErr(name, ok ? '' : 'Enter a valid name (letters only, max 16 chars)');
      if (!ok) valid = false;
    }
    if (phone) {
      const ok = /^[6-9][0-9]{9}$/.test(phone.value.trim());
      setErr(phone, ok ? '' : 'Enter a valid 10-digit Indian mobile number');
      if (!ok) valid = false;
    }
    if (email) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      setErr(email, ok ? '' : 'Enter a valid email address');
      if (!ok) valid = false;
    }

    if (valid) {
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<span>Message Sent ✦</span>';
      form.reset();
      setTimeout(() => btn.innerHTML = original, 2600);
    }
  });
});

// ===== Lightbox for gallery =====
document.querySelectorAll('.g-item img, .cat-card img').forEach(img => {
  img.addEventListener('click', () => {
    const lb = document.createElement('div');
    lb.style.cssText = 'position:fixed;inset:0;background:rgba(15,14,12,.94);z-index:9998;display:flex;align-items:center;justify-content:center;cursor:zoom-out;animation:fadeUp .4s ease;padding:40px;';
    const im = document.createElement('img');
    im.src = img.src; im.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;box-shadow:0 30px 80px rgba(0,0,0,.6);';
    lb.appendChild(im);
    lb.addEventListener('click', () => lb.remove());
    document.body.appendChild(lb);
  });
});
// ===== Newsletter (footer + contact page) =====
document.querySelectorAll('.newsletter-row').forEach(row => {
  const input = row.querySelector('input[type="email"]');
  const btn = row.querySelector('button');
  if (!input || !btn) return;

  const msg = document.createElement('div');
  msg.className = 'nl-msg';
  msg.setAttribute('aria-live', 'polite');
  row.insertAdjacentElement('afterend', msg);

  const show = (text, ok) => {
    msg.textContent = text;
    msg.style.color = ok ? 'var(--gold-light, #e8cf7a)' : '#e57373';
  };

  const submit = () => {
    const val = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      show('Please enter a valid email address.', false);
      return;
    }
    // TODO: send `val` to your backend / mailing service here
    input.value = '';
    show('Thank you for subscribing ✦', true);
    setTimeout(() => show('', true), 4000);
  };

  btn.type = 'button';
  btn.style.cursor = 'pointer';
  btn.addEventListener('click', submit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
});