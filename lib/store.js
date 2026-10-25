import { put, get, list, del } from '@vercel/blob';

const opts = { access: 'private' };
// useCache:false = toujours la dernière version (sinon le CDN peut servir l'ancienne ~60 s après une modification)
const readOpts = { ...opts, useCache: false };

async function readJson(pathname) {
  const res = await get(pathname, readOpts);
  if (!res || res.statusCode !== 200) return null;
  return JSON.parse(await new Response(res.stream).text());
}

async function writeJson(pathname, data) {
  await put(pathname, JSON.stringify(data), {
    ...opts,
    contentType: 'application/json',
    allowOverwrite: true,
    addRandomSuffix: false,
  });
}

async function listAll(prefix) {
  const out = [];
  let cursor;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    const loaded = await Promise.all(page.blobs.map((b) => readJson(b.pathname).catch(() => null)));
    out.push(...loaded.filter(Boolean));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

export const saveOrder = (order) => writeJson(`orders/${order.id}.json`, order);
export const loadOrder = (id) => readJson(`orders/${id}.json`);
export const listOrders = async () => (await listAll('orders/')).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const savePurchase = (p) => writeJson(`purchases/${p.id}.json`, p);
export const deletePurchase = (id) => del(`purchases/${id}.json`);
export const listPurchases = async () => (await listAll('purchases/')).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
