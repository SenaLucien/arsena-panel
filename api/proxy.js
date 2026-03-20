export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const PANEL = 'https://xarsena.pterohost.biz.id';
  const PTLA  = 'ptla_2HzpqAthds4hMgLRdnmTCWbgZQIDd6C1zpzSwlELHB2';
  const PTLC  = 'ptlc_hwdvKV5V9yxWeMYI5VRgIWUIcJKjOAca8sg6DkW0nZh';

  // path: /api/proxy?path=/api/application/servers
  const { path, useClient } = req.query;
  if (!path) return res.status(400).json({ error: 'missing path' });

  const apiKey = useClient === '1' ? PTLC : PTLA;
  const url    = PANEL + path;

  try {
    const opts = {
      method:  req.method,
      headers: {
        'Authorization':  'Bearer ' + apiKey,
        'Accept':         'application/json',
        'Content-Type':   'application/json',
      },
    };

    if (req.method !== 'GET' && req.method !== 'DELETE' && req.body) {
      opts.body = JSON.stringify(req.body);
    }

    const upstream = await fetch(url, opts);

    if (upstream.status === 204) return res.status(204).end();

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
