// =========================================================
// script.js - Pwani Roasters
// Order follows the page: helpers, header, plan, signup, start
// Each feature skips quietly if its HTML is not on the page yet.
// =========================================================

// ---------- 1. Helpers ----------
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

// ---------- 2. Header: shadow when scrolled ----------
function initHeaderShadow() {
  const header = $('header');
  if (!header) return;

  window.addEventListener(
    'scroll',
    () => header.classList.toggle('scrolled', window.scrollY > 8),
    { passive: true }
  );
}

// ---------- 3. Header: mobile menu (hamburger) ----------
function initMobileMenu() {
  const button = $('.menu-btn');
  const nav = $('#nav');
  if (!button || !nav) return;

  const setMenu = (isOpen) => {
    nav.classList.toggle('open', isOpen);
    button.setAttribute('aria-expanded', isOpen);
  };

  button.addEventListener('click', () => setMenu(!nav.classList.contains('open')));

  // Close after tapping a link, or with the Escape key
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });
}

// ---------- 4. Header: highlight the link of the section in view ----------
function initActiveLink() {
  const links = $$('nav a[href^="#"]:not(.btn)');
  if (links.length === 0 || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  links.forEach((link) => {
    const section = $(link.getAttribute('href'));
    if (section) observer.observe(section);
  });
}

// ---------- 5. Plan builder: live price ----------
function initPlanBuilder() {
  const priceEl = $('#price');
  const descEl = $('#desc');
  const saveEl = $('#save small');
  if (!priceEl || !descEl || !saveEl) return;

  const basePrices = { 250: 24000, 500: 44000, 1000: 80000 }; // TZS per bag size
  const discounts = { weekly: 0.1, fortnight: 0.05, monthly: 0 };
  const labels = { weekly: 'every week', fortnight: 'every 2 weeks', monthly: 'monthly' };

  const getValue = (name) => $('input[name="' + name + '"]:checked').value;
  const formatPrice = (amount) => 'TZS ' + Math.round(amount).toLocaleString('en-US');

  function update() {
    const size = getValue('size');
    const frequency = getValue('freq');
    const roast = getValue('roast');

    const fullPrice = basePrices[size];
    const finalPrice = fullPrice * (1 - discounts[frequency]);

    // New price, with a small "bump" animation
    priceEl.textContent = formatPrice(finalPrice);
    priceEl.classList.remove('bump');
    void priceEl.offsetWidth; // restarts the animation
    priceEl.classList.add('bump');

    const sizeText = size === '1000' ? '1 kg' : size + ' g';
    descEl.textContent = roast + ' roast, ' + sizeText + ', ' + labels[frequency];

    saveEl.textContent = discounts[frequency]
      ? 'You save ' + formatPrice(fullPrice - finalPrice) + ' per bag.'
      : 'Choose a shorter delivery gap to save up to 10%.';
  }

  $$('.builder input').forEach((input) => input.addEventListener('change', update));
  update(); // run once when the page loads
}

// ---------- 6. Signup: email validation ----------
function initSignupForm() {
  const form = $('#form');
  const emailInput = $('#email');
  const message = $('#msg');
  if (!form || !emailInput || !message) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // stop the page from reloading

    const email = emailInput.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // something@something.something

    if (!isValid) {
      message.textContent = 'Enter a valid email, like you@example.com.';
      emailInput.focus();
      return;
    }

    message.textContent = 'Sent. Check ' + email + ' for your plan link.';
    form.reset();
  });
}

// ---------- 7. Start everything ----------
initHeaderShadow();
initMobileMenu();
initActiveLink();
initPlanBuilder();
initSignupForm();
