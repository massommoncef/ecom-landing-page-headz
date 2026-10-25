import { put, get, list } from '@vercel/blob';

const opts = { access: 'private' };

async function readJson(pathname) {
  const res = await get(pathname, opts);
  if (!res || res.statusCode !== 200) return null;
  return JSON.parse(await new Response(res.stream).text());
}

export async function saveOrder(order) {
  await put(`orders/${order.id}.json`, JSON.stringify(order), {
    ...opts,
    contentType: 'application/json',
    allowOverwrite: true,
    addRandomSuffix: false,
  });
}

export const loadOrder = (id) => readJson(`orders/${id}.json`);

export async function listOrders() {
  const out = [];
  let cursor;
  do {
    const page = await list({ prefix: 'orders/', cursor, limit: 1000 });
    const loaded = await Promise.all(page.blobs.map((b) => readJson(b.pathname).catch(() => null)));
    out.push(...loaded.filter(Boolean));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
