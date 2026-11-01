import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const YUPOO_REFERER = 'https://leemade.x.yupoo.com/';

function isAllowedYupooImageUrl(raw) {
  try {
    const parsed = new URL(raw);
    if (!['photo.yupoo.com', 'photo3.yupoo.com'].includes(parsed.hostname)) {
      return false;
    }
    return parsed.pathname.startsWith('/leemade/');
  } catch {
    return false;
  }
}

function yupooImageProxyPlugin() {
  return {
    name: 'yupoo-image-proxy',
    configureServer(server) {
      server.middlewares.use('/api/yupoo-image', async (req, res) => {
        const requestUrl = new URL(req.url, 'http://localhost');
        const target = requestUrl.searchParams.get('url');
        if (!target || !isAllowedYupooImageUrl(target)) {
          res.statusCode = 400;
          res.end('Invalid image URL');
          return;
        }
        try {
          const upstream = await fetch(target, {
            headers: {
              Referer: YUPOO_REFERER,
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
          });
          if (!upstream.ok) {
            res.statusCode = upstream.status;
            res.end();
            return;
          }
          res.setHeader(
            'Content-Type',
            upstream.headers.get('content-type') || 'image/jpeg'
          );
          res.setHeader('Cache-Control', 'public, max-age=86400');
          const buf = Buffer.from(await upstream.arrayBuffer());
          res.end(buf);
        } catch {
          res.statusCode = 502;
          res.end('Upstream fetch failed');
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), yupooImageProxyPlugin()],
});
