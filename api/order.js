import { randomBytes } from 'node:crypto';
import { PRICE, MODELS, MAX_QTY } from '../lib/config.js';
import { WILAYAS } from '../lib/wilayas.js';
import { saveOrder } from '../lib/store.js';
import { notifyTelegram } from '../lib/notify.js';

const clean = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const b = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};

  // Honeypot anti-bots : on fait semblant de réussir.
  if (b.website) return res.status(200).json({ ok: true, id: 'HZ-OK' });

  const name = clean(b.name, 80);
  const phone = clean(b.phone, 20).replace(/[\s.\-]/g, '').replace(/^(\+213|00213)/, '0');
  const wilaya = clean(b.wilaya, 40);
  const commune = clean(b.commune, 60);
  const note = clean(b.note, 300);

  const errors = {};
  if (name.length < 3) errors.name = 'Entre ton nom complet';
  if (!/^0[567]\d{8}$/.test(phone)) errors.phone = 'Numéro invalide (ex : 0555 12 34 56)';
  if (!WILAYAS.includes(wilaya)) errors.wilaya = 'Choisis ta wilaya';
  if (commune.length < 2) errors.commune = 'Entre ta commune';

  const rawItems = Array.isArray(b.items) ? b.items : [];
  const items = rawItems
    .map((i) => ({ model: String(i?.model), qty: Math.floor(Number(i?.qty)) }))
    .filter((i) => MODELS[i.model] && i.qty >= 1 && i.qty <= MAX_QTY)
    .map((i) => ({ ...i, modelLabel: MODELS[i.model] }));
  if (!items.length) errors.items = 'Choisis au moins un bonnet';

  if (Object.keys(errors).length) return res.status(400).json({ error: 'Formulaire invalide', errors });

  const qty = items.reduce((s, i) => s + i.qty, 0);
  const id = `HZ-${Date.now().toString(36).toUpperCase()}${randomBytes(2).toString('hex').toUpperCase()}`;
  const order = {
    id,
    createdAt: new Date().toISOString(),
    status: 'nouvelle',
    history: [{ status: 'nouvelle', at: new Date().toISOString() }],
    name,
    phone,
    wilaya,
    commune,
    note,
    items,
    qty,
    total: qty * PRICE,
    source: clean(b.source, 60),
  };

  try {
    await saveOrder(order);
  } catch (e) {
    console.error('saveOrder failed', e);
    return res.status(500).json({ error: "Erreur d'enregistrement, réessaie dans un instant." });
  }
  await notifyTelegram(order);
  return res.status(200).json({ ok: true, id, total: order.total });
}
