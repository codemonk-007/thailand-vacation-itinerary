/* Thailand, without the rush — interactions */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------- reading progress ---------- */
  var progress = document.getElementById('progress');
  function updateProgress() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = Math.min(100, Math.max(0, pct)) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Menu';
      });
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(
    '.route-stop, .callout, .glance, .chapter, .day, .flight-card, .flight-total, .note-card, .stay-card, .stay-foot, .food-feature, .dish, .budget-layout, .budget-bottom, .accordion, .packing, .source, .credits'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- budget calculator ---------- */
  var PRICES = {
    flights: 52861,
    stays: { smart: 34000, splurge: 90000 },
    food: { street: 13200, mixed: 24200, fine: 44000 },
    activities: 14500,
    transport: 8000,
    misc: 3500
  };
  var state = { travellers: 2, stay: 'smart', food: 'mixed' };

  var travellersOut = document.getElementById('calcTravellers');
  var totalOut = document.getElementById('calcTotal');
  var perOut = document.getElementById('calcPer');
  var noteOut = document.getElementById('calcNote');
  var breakdown = document.getElementById('breakdown');

  function inr(n) {
    return '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n));
  }

  function updateBudget() {
    var perPerson = PRICES.flights + PRICES.stays[state.stay] + PRICES.food[state.food] +
      PRICES.activities + PRICES.transport + PRICES.misc;
    var buffer = perPerson * 0.10;
    var perPersonWithBuffer = perPerson + buffer;
    var groupTotal = perPersonWithBuffer * state.travellers;

    if (travellersOut) travellersOut.textContent = state.travellers;
    if (totalOut) totalOut.textContent = inr(groupTotal);
    if (perOut) perOut.textContent = inr(perPersonWithBuffer) + ' per person';
    if (noteOut) {
      var stayLabel = state.stay === 'smart' ? 'smart stays' : 'splurge stays';
      var foodLabel = state.food === 'street' ? 'street-food eating' : state.food === 'fine' ? 'fine dining' : 'mixed eating';
      noteOut.textContent = 'Includes flights, 11 nights, ' + foodLabel + ', ' + stayLabel +
        ', tours, local transport, eSIM and a 10% buffer.';
    }

    if (breakdown) {
      var rows = {
        flights: PRICES.flights,
        stays: PRICES.stays[state.stay],
        food: PRICES.food[state.food],
        activities: PRICES.activities,
        transport: PRICES.transport,
        misc: PRICES.misc,
        buffer: buffer
      };
      Object.keys(rows).forEach(function (key) {
        var row = breakdown.querySelector('[data-key="' + key + '"]');
        if (!row) return;
        var value = rows[key];
        var pct = (value / perPersonWithBuffer) * 100;
        row.querySelector('b').textContent = inr(value);
        row.querySelector('.bar i').style.width = Math.max(1.5, pct).toFixed(1) + '%';
      });
    }
  }

  document.querySelectorAll('[data-travellers]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.travellers = Number(btn.getAttribute('data-travellers'));
      document.querySelectorAll('[data-travellers]').forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      updateBudget();
    });
  });

  document.querySelectorAll('[data-stay]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.stay = btn.getAttribute('data-stay');
      document.querySelectorAll('[data-stay]').forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      updateBudget();
    });
  });

  document.querySelectorAll('[data-food]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.food = btn.getAttribute('data-food');
      document.querySelectorAll('[data-food]').forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      updateBudget();
    });
  });

  updateBudget();
})();
