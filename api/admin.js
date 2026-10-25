import { timingSafeEqual } from 'node:crypto';
import { listOrders, loadOrder, saveOrder } from '../lib/store.js';
import { STATUSES } from '../lib/config.js';

function authorized(req) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(String(req.headers['x-admin-password'] || ''));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!authorized(req)) return res.status(401).json({ error: 'Mot de passe incorrect' });

  try {
    if (req.method === 'GET') return res.status(200).json({ orders: await listOrders() });

    if (req.method === 'POST') {
      const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      if (!STATUSES.includes(b.status) || !/^HZ-[A-Z0-9]+$/.test(String(b.id)))
        return res.status(400).json({ error: 'Requête invalide' });
      const order = await loadOrder(b.id);
      if (!order) return res.status(404).json({ error: 'Commande introuvable' });
      order.status = b.status;
      order.updatedAt = new Date().toISOString();
      await saveOrder(order);
      return res.status(200).json({ ok: true, order });
    }
    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
