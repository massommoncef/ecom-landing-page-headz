import { WILAYAS } from '/wilayas.js';
import { t, apply, setLang, onLang, LANGS } from '/i18n.js';

const PRICE = 2100;
const MAX_QTY = 10;
const cfg = window.HEADZ || {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = (n) => `${n.toLocaleString('fr-FR').replace(/\s/g, ' ')} ${t('unit')}`;

/* ---------- Pixels publicitaires (optionnels) ---------- */
if (cfg.metaPixelId) {
  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  fbq('init', cfg.metaPixelId);
  fbq('track', 'PageView');
}
if (cfg.tiktokPixelId) {
  /* eslint-disable */
  !(function (w, d, t) { w.TiktokAnalyticsObject = t; var ttq = (w[t] = w[t] || []); ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie']; ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; }; for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]); ttq.load = function (e) { var n = 'https://analytics.tiktok.com/i18n/pixel/events.js'; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._t = ttq._t || {}; ttq._t[e] = +new Date(); var o = d.createElement('script'); o.type = 'text/javascript'; o.async = !0; o.src = n + '?sdkid=' + e + '&lib=' + t; var a = d.getElementsByTagName('script')[0]; a.parentNode.insertBefore(o, a); }; ttq.load(cfg.tiktokPixelId); ttq.page(); })(window, document, 'ttq');
  /* eslint-enable */
}

/* ---------- Formulaire ---------- */
const form = $('#form');
const wilayaSel = form.wilaya;
WILAYAS.forEach((w, i) => wilayaSel.add(new Option(`${String(i + 1).padStart(2, '0')} - ${w}`, w)));

const qtyOf = (row) => Number($('output', row).textContent);
function refresh() {
  let total = 0;
  $$('.item').forEach((row) => {
    const q = qtyOf(row);
    row.classList.toggle('on', q > 0);
    total += q;
  });
  $('#s-qty').textContent = total;
  $('#s-total').textContent = fmt(total * PRICE);
  $('#submit').textContent = total ? t('submitTotal', { total: fmt(total * PRICE) }) : t('submit');
}
$$('.stepper button').forEach((btn) =>
  btn.addEventListener('click', () => {
    const out = $('output', btn.parentElement);
    out.textContent = Math.min(MAX_QTY, Math.max(0, Number(out.textContent) + Number(btn.dataset.d)));
    setErr('items', '');
    refresh();
  }),
);
refresh();

function setErr(field, msg) {
  const el = $(`.err[data-for="${field}"]`);
  if (el) el.textContent = msg;
  const input = form.elements[field];
  if (input && input.setAttribute) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
}
['name', 'phone', 'wilaya', 'commune'].forEach((f) => form.elements[f].addEventListener('input', () => setErr(f, '')));

function normPhone(v) {
  return v.replace(/[\s.\-]/g, '').replace(/^(\+213|00213)/, '0');
}
function validate(d) {
  const e = {};
  if (d.name.trim().length < 3) e.name = t('eName');
  if (!/^0[567]\d{8}$/.test(normPhone(d.phone))) e.phone = t('ePhone');
  if (!d.wilaya) e.wilaya = t('eWilaya');
  if (d.commune.trim().length < 2) e.commune = t('eCommune');
  if (!d.items.length) e.items = t('eItems');
  return e;
}

let tracked = false;
form.addEventListener('focusin', () => {
  if (tracked) return;
  tracked = true;
  window.fbq && fbq('track', 'InitiateCheckout');
  window.ttq && ttq.track('InitiateCheckout');
});

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const formErr = $('#form-err');
  formErr.textContent = '';
  const items = $$('.item')
    .map((r) => ({ model: r.dataset.model, qty: qtyOf(r) }))
    .filter((i) => i.qty > 0);
  const data = {
    name: form.name.value,
    phone: form.phone.value,
    wilaya: form.wilaya.value,
    commune: form.commune.value,
    note: form.note.value,
    website: form.website.value,
    items,
    source: new URLSearchParams(location.search).get('utm_source') || document.referrer.split('/')[2] || 'direct',
  };
  const errors = validate(data);
  ['name', 'phone', 'wilaya', 'commune', 'items'].forEach((f) => setErr(f, errors[f] || ''));
  if (Object.keys(errors).length) {
    const first = Object.keys(errors)[0];
    (form.elements[first] || $('.items')).scrollIntoView({ block: 'center', behavior: 'smooth' });
    form.elements[first]?.focus?.({ preventScroll: true });
    return;
  }

  const btn = $('#submit');
  btn.disabled = true;
  btn.textContent = t('sending');
  try {
    const r = await fetch('/api/order', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      if (j.errors) Object.entries(j.errors).forEach(([k, v]) => setErr(k, v));
      throw new Error(r.status === 400 ? t('eGen') : j.error || t('eGen'));
    }
    const value = j.total ?? items.reduce((s, i) => s + i.qty, 0) * PRICE;
    window.fbq && fbq('track', 'Purchase', { value, currency: 'DZD' });
    window.ttq && ttq.track('CompletePayment', { value, currency: 'DZD' });
    $('#ok-msg').dataset.name = data.name.trim().split(' ')[0].replace(/[<>&]/g, '');
    $('#ok-id').textContent = j.id;
    $('#ok-total').textContent = fmt(value);
    form.hidden = true;
    $('.sub').hidden = true;
    $('#order-h').dataset.i18n = 'thanks';
    apply();
    $('#success').hidden = false;
    window.confetti?.();
    $('#commander').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    formErr.textContent = err.message || t('eGen');
    btn.disabled = false;
    refresh();
  }
});

/* ---------- Barre collante : cachée quand le formulaire est visible ---------- */
const sticky = $('#sticky');
new IntersectionObserver(([e]) => sticky.classList.toggle('hide', e.isIntersecting), { threshold: 0.15 }).observe($('#commander'));

/* ---------- Animations ---------- */
const top = $('.top');
addEventListener('scroll', () => top.classList.toggle('scrolled', scrollY > 20), { passive: true });

// apparition au scroll (avec décalage pour les listes)
$$('.steps li, details').forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--d', `${(i % 5) * 0.09}s`); });
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
$$('.reveal').forEach((el) => io.observe(el));

// effet 3D au survol de la photo
const card = $('.video-card');
if (card && matchMedia('(hover:hover)').matches) {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  card.addEventListener('pointerleave', () => (card.style.transform = ''));
}

// petit "rebond" quand le total change
const bump = (el) => { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); };
$$('.stepper button').forEach((b) => b.addEventListener('click', () => { bump($('output', b.parentElement)); bump($('#s-total')); }));

// confettis à la confirmation
window.confetti = () => {
  const colors = ['#8fd3ff', '#4ade80', '#f4f3ef', '#6c5ce7', '#ffd666'];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement('i');
    c.className = 'confetti';
    c.style.cssText = `left:${Math.random() * 100}vw;background:${colors[i % 5]};animation-duration:${2 + Math.random() * 2.2}s;animation-delay:${Math.random() * 0.5}s;border-radius:${i % 3 ? '2px' : '50%'}`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5000);
  }
};

/* ---------- Langue : menu déroulant ---------- */
const langBtn = $('#lang-btn');
const langMenu = $('#lang-menu');
const toggleLang = (open) => {
  langMenu.classList.toggle('open', open);
  langBtn.setAttribute('aria-expanded', String(open));
};
langBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleLang(!langMenu.classList.contains('open')); });
langMenu.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-lang]');
  if (!b) return;
  setLang(b.dataset.lang);
  toggleLang(false);
});
document.addEventListener('click', () => toggleLang(false));
document.addEventListener('keydown', (e) => e.key === 'Escape' && toggleLang(false));
onLang(() => { refresh(); $$('.err[data-for]').forEach((el) => (el.textContent = '')); });
apply();
