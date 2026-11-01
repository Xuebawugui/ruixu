const ALLOWED_HOSTS = new Set(['photo.yupoo.com', 'photo3.yupoo.com']);
const DEFAULT_REFERER = 'https://leemade.x.yupoo.com/';

function isAllowedImageUrl(raw) {
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return false;
  }
  if (!ALLOWED_HOSTS.has(parsed.hostname)) return false;
  if (!parsed.pathname.startsWith('/leemade/')) return false;
  return true;
}

export default async function handler(req, res) {
  const url = req.query?.url;
  if (!url || typeof url !== 'string' || !isAllowedImageUrl(url)) {
    res.status(400).json({ error: 'Invalid image URL' });
    return;
  }

  const referer = process.env.YUPOO_REFERER || DEFAULT_REFERER;

  try {
    const upstream = await fetch(url, {
      headers: {
        Referer: referer,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!upstream.ok) {
      res.status(upstream.status).end();
      return;
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.status(200).send(buffer);
  } catch {
    res.status(502).json({ error: 'Upstream fetch failed' });
  }
}
