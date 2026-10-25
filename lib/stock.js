import { MODELS } from './config.js';

// Statuts qui réservent du stock (marchandise sortie du "disponible" mais pas encore livrée).
export const RESERVING = ['confirmee', 'expediee'];
// Statuts qui consomment définitivement le stock.
export const CONSUMING = ['livree'];

/**
 * Le stock est TOUJOURS recalculé depuis les achats et les statuts des commandes :
 *   acheté − livré = en stock physique (chez toi ou chez le livreur)
 *   en stock physique − réservé (confirmées / chez le livreur) = disponible
 * Une commande en "retour" ou "annulée" n'est ni réservée ni livrée : sa quantité remonte seule.
 */
export function computeStock(orders, purchases) {
  const out = {};
  for (const [model, label] of Object.entries(MODELS))
    out[model] = { model, label, purchased: 0, spent: 0, delivered: 0, reserved: 0 };

  for (const p of purchases) {
    const s = out[p.model];
    if (!s) continue;
    s.purchased += p.qty;
    s.spent += p.qty * p.unitCost;
  }
  for (const o of orders)
    for (const i of o.items) {
      const s = out[i.model];
      if (!s) continue;
      if (CONSUMING.includes(o.status)) s.delivered += i.qty;
      else if (RESERVING.includes(o.status)) s.reserved += i.qty;
    }
  for (const s of Object.values(out)) {
    s.onHand = s.purchased - s.delivered;
    s.available = s.onHand - s.reserved;
    s.avgCost = s.purchased ? s.spent / s.purchased : 0;
    s.value = Math.max(0, s.onHand) * s.avgCost;
    s.cogs = s.delivered * s.avgCost;
  }
  return out;
}

/** Vérifie qu'on peut passer `order` au statut `next` sans stock négatif. Retourne un message ou null. */
export function stockError(orders, purchases, order, next) {
  if (![...RESERVING, ...CONSUMING].includes(next)) return null;
  const hypo = orders.map((o) => (o.id === order.id ? { ...o, status: next } : o));
  const stock = computeStock(hypo, purchases);
  for (const i of order.items) {
    const s = stock[i.model];
    if (s && s.available < 0)
      return `Stock insuffisant pour ${s.label} : il manque ${-s.available} pièce(s). Ajoute un achat dans l'onglet Stock.`;
  }
  return null;
}
