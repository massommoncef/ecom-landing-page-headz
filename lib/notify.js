// Notification Telegram (optionnelle) : TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
const esc = (s) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]);

export async function notifyTelegram(o) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return false;
  const text =
    `🧢 <b>Nouvelle commande ${esc(o.id)}</b>\n` +
    `👤 ${esc(o.name)}\n📞 ${esc(o.phone)}\n` +
    `📍 ${esc(o.wilaya)} — ${esc(o.commune)}\n` +
    `🛍 ${esc(o.items.map((i) => `${i.qty}× ${i.modelLabel}`).join(', '))}\n` +
    `💰 <b>${o.total} DA</b> (livraison gratuite, paiement à la livraison)` +
    (o.note ? `\n📝 ${esc(o.note)}` : '');
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: 'HTML' }),
    });
    return r.ok;
  } catch {
    return false;
  }
}
