/**
 * 从公开 Yupoo 相册页抓取分类与相册列表（及可选详情图）。
 * 用法: node scripts/sync-yupoo.mjs [--with-images] [--max-albums 200]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'public', 'site-config.json');
const OUT_PATH = path.join(ROOT, 'public', 'data', 'catalog.json');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const args = process.argv.slice(2);
const withImages = args.includes('--with-images');
const maxAlbumsArg = args.find((a) => a.startsWith('--max-albums='));
const maxAlbums = maxAlbumsArg ? Number(maxAlbumsArg.split('=')[1]) : Infinity;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.text();
}

function parseCategories(html) {
  const re =
    /<a href="(\/categories\/(\d+))">\s*<li class="text_overflow">([\s\S]*?)<\/li>/gi;
  const list = [];
  let m;
  while ((m = re.exec(html))) {
    list.push({
      id: m[2],
      path: m[1],
      name: m[3].replace(/\s+/g, ' ').trim(),
    });
  }
  return list;
}

function parseCategoryPage(html) {
  const albums = [];
  const re =
    /class="album__main"[\s\S]*?title="([^"]*)"[\s\S]*?href="(\/albums\/(\d+)[^"]*)"[\s\S]*?data-src="([^"]+)"[\s\S]*?album__photonumber">(\d+)/gi;
  let m;
  while ((m = re.exec(html))) {
    albums.push({
      id: m[3],
      title: (m[1] || '').trim(),
      href: m[2],
      cover: m[4],
      photoCount: Number(m[5]) || 0,
    });
  }
  return albums;
}

function parseCategoryPages(html) {
  const m = html.match(
    /categories__box-right-pagination-span">(\d+)\s*\/\s*(\d+)/
  );
  if (!m) return 1;
  return Number(m[2]) || 1;
}

function parseAlbumImages(html) {
  const re = /\/leemade\/[a-f0-9]+\/[a-f0-9]+\.(?:jpg|jpeg|png|webp)/gi;
  const set = new Set();
  let m;
  while ((m = re.exec(html))) {
    set.add(`https://photo.yupoo.com${m[0]}`);
  }
  return [...set];
}

async function main() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const base = config.yupooSource.replace(/\/$/, '');

  console.log('Fetching categories from', base);
  const homeHtml = await fetchText(`${base}/albums/`);
  const categories = parseCategories(homeHtml);
  console.log(`Found ${categories.length} categories`);

  const albums = [];
  const seen = new Set();

  for (const cat of categories) {
    const catUrl = `${base}${cat.path}`;
    let catHtml;
    try {
      catHtml = await fetchText(catUrl);
    } catch (e) {
      console.warn('Skip category', cat.name, e.message);
      continue;
    }
    const totalPages = parseCategoryPages(catHtml);
    for (let page = 1; page <= totalPages; page++) {
      const pageUrl = page === 1 ? catUrl : `${catUrl}?page=${page}`;
      let html = page === 1 ? catHtml : await fetchText(pageUrl);
      const pageAlbums = parseCategoryPage(html);
      for (const a of pageAlbums) {
        if (seen.has(a.id)) continue;
        seen.add(a.id);
        albums.push({
          ...a,
          categoryId: cat.id,
          categoryName: cat.name,
          images: [],
        });
        if (albums.length >= maxAlbums) break;
      }
      if (albums.length >= maxAlbums) break;
      await sleep(300);
    }
    if (albums.length >= maxAlbums) break;
    await sleep(400);
  }

  if (withImages) {
    console.log(`Fetching images for ${albums.length} albums...`);
    for (let i = 0; i < albums.length; i++) {
      const a = albums[i];
      const url = `${base}/albums/${a.id}?uid=1`;
      try {
        const html = await fetchText(url);
        a.images = parseAlbumImages(html);
        if (!a.title) {
          const t = html.match(/<title[^>]*>([^<|]+)/);
          if (t) a.title = t[1].trim();
        }
      } catch (e) {
        console.warn('Album images failed', a.id, e.message);
      }
      if ((i + 1) % 20 === 0) console.log(`  ${i + 1}/${albums.length}`);
      await sleep(350);
    }
  }

  const out = {
    syncedAt: new Date().toISOString(),
    source: base,
    categories,
    albums,
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${albums.length} albums -> ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
