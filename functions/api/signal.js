const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'access-control-allow-headers': 'content-type'
    }
  });

const keyFor = (room, action) => `onlyus:${room}:${action}`;

export async function onRequestOptions() {
  return json({ ok: true });
}

export async function onRequest({ request, env }) {
  if (!env.ONLYUS_SIGNAL) {
    return json({ error: 'Missing KV binding: ONLYUS_SIGNAL' }, 500);
  }

  const url = new URL(request.url);
  const action = (url.searchParams.get('a') || '').trim();
  const room = (url.searchParams.get('r') || '').trim();

  if (!action || !room) {
    return json({ error: 'Missing query params: a (action), r (room)' }, 400);
  }

  if (request.method === 'POST') {
    const payload = await request.text();
    await env.ONLYUS_SIGNAL.put(keyFor(room, action), payload, {
      expirationTtl: 180
    });
    return json({ ok: true });
  }

  if (request.method === 'GET') {
    const data = await env.ONLYUS_SIGNAL.get(keyFor(room, action));
    return json({ ok: true, data });
  }

  return json({ error: 'Method not allowed' }, 405);
}
