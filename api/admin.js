import { timingSafeEqual, randomBytes } from 'node:crypto';
import { listOrders, loadOrder, saveOrder, listPurchases, savePurchase, deletePurchase } from '../lib/store.js';
import { STATUSES, MODELS } from '../lib/config.js';
import { computeStock, stockError } from '../lib/stock.js';

function authorized(req) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(String(req.headers['x-admin-password'] || ''));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

const bad = (res, msg, code = 400) => res.status(code).json({ error: msg });

async function snapshot() {
  const [orders, purchases] = await Promise.all([listOrders(), listPurchases()]);
  return { orders, purchases, stock: computeStock(orders, purchases) };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!authorized(req)) return bad(res, 'Mot de passe incorrect', 401);

  try {
    if (req.method === 'GET') return res.status(200).json(await snapshot());
    if (req.method !== 'POST') return bad(res, 'Méthode non autorisée', 405);

    const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    /* ---- changer le statut d'une commande ---- */
    if (b.action === 'status') {
      if (!STATUSES.includes(b.status) || !/^HZ-[A-Z0-9]+$/.test(String(b.id))) return bad(res, 'Requête invalide');
      const [order, orders, purchases] = await Promise.all([loadOrder(b.id), listOrders(), listPurchases()]);
      if (!order) return bad(res, 'Commande introuvable', 404);
      if (order.status !== b.status) {
        const err = stockError(orders, purchases, order, b.status);
        if (err) return bad(res, err, 409);
        const now = new Date().toISOString();
        order.status = b.status;
        order.updatedAt = now;
        order.history = [...(order.history || []), { status: b.status, at: now }];
        await saveOrder(order);
      }
      return res.status(200).json({ ok: true, ...(await snapshot()) });
    }

    /* ---- numéro de suivi du livreur ---- */
    if (b.action === 'tracking') {
      if (!/^HZ-[A-Z0-9]+$/.test(String(b.id))) return bad(res, 'Requête invalide');
      const order = await loadOrder(b.id);
      if (!order) return bad(res, 'Commande introuvable', 404);
      order.tracking = String(b.tracking ?? '').trim().slice(0, 60);
      await saveOrder(order);
      return res.status(200).json({ ok: true, ...(await snapshot()) });
    }

    /* ---- ajouter un achat (réapprovisionnement) ---- */
    if (b.action === 'addPurchase') {
      const qty = Math.floor(Number(b.qty));
      const unitCost = Number(b.unitCost);
      if (!MODELS[b.model]) return bad(res, 'Modèle invalide');
      if (!(qty >= 1 && qty <= 100000)) return bad(res, 'Quantité invalide');
      if (!(unitCost >= 0 && unitCost <= 1e6)) return bad(res, "Prix d'achat invalide");
      const date = /^\d{4}-\d{2}-\d{2}$/.test(String(b.date)) ? b.date : new Date().toISOString().slice(0, 10);
      const p = {
        id: `PU-${Date.now().toString(36).toUpperCase()}${randomBytes(2).toString('hex').toUpperCase()}`,
        createdAt: new Date().toISOString(),
        date,
        model: b.model,
        modelLabel: MODELS[b.model],
        qty,
        unitCost: Math.round(unitCost * 100) / 100,
        note: String(b.note ?? '').trim().slice(0, 100),
      };
      await savePurchase(p);
      return res.status(200).json({ ok: true, ...(await snapshot()) });
    }

    /* ---- supprimer un achat (refusé si ça rend le stock négatif) ---- */
    if (b.action === 'deletePurchase') {
      if (!/^PU-[A-Z0-9]+$/.test(String(b.id))) return bad(res, 'Requête invalide');
      const { orders, purchases } = await snapshot();
      const p = purchases.find((x) => x.id === b.id);
      if (!p) return bad(res, 'Achat introuvable', 404);
      const after = computeStock(orders, purchases.filter((x) => x.id !== b.id))[p.model];
      if (after.available < 0)
        return bad(res, `Impossible : ${after.label} passerait à ${after.available} (commandes déjà confirmées/livrées).`, 409);
      await deletePurchase(b.id);
      return res.status(200).json({ ok: true, ...(await snapshot()) });
    }

    return bad(res, 'Action inconnue');
  } catch (e) {
    console.error(e);
    return bad(res, 'Erreur serveur', 500);
  }
}
