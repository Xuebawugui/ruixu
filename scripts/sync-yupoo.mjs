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
const imagesOnly = args.includes('--images-only');
const maxAlbumsArg = args.find((a) => a.startsWith('--max-albums='));
const maxAlbums = maxAlbumsArg ? Number(maxAlbumsArg.split('=')[1]) : Infinity;
const SAVE_EVERY = 40;

function sanitizeCatalogText(text) {
  if (!text || typeof text !== 'string') return text;
  let s = text;
  s = s.replace(/【\s*LeeMade\s*】/gi, '');
  s = s.replace(/\[?\s*LeeMade\s*\]?/gi, '');
  s = s.replace(
    /【\s*\$\s*[\d.]+\s*(?:&x3D;|&#x3D;|＝|=)\s*[￥¥]\s*[\d.]+\s*】/gi,
    ''
  );
  s = s.replace(/【\s*\$\s*[\d.]+\s*[￥¥]\s*[\d.]+\s*】/gi, '');
  return s.replace(/\s{2,}/g, ' ').trim();
}

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

function isExcludedCategory(cat, config) {
  const ids = new Set(config.excludeCategoryIds || []);
  if (ids.has(cat.id)) return true;
  const patterns = (config.excludeCategoryNameIncludes || []).map((s) =>
    s.toLowerCase()
  );
  if (!patterns.length) return false;
  const name = (cat.name || '').toLowerCase();
  return patterns.some((p) => name.includes(p));
}

function writeCatalog(out) {
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf8');
}

async function fetchAlbumImages(base, album) {
  const url = `${base}/albums/${album.id}?uid=1`;
  const html = await fetchText(url);
  album.images = parseAlbumImages(html);
  if (!album.title) {
    const t = html.match(/<title[^>]*>([^<|]+)/);
    if (t) album.title = t[1].trim();
  }
}

async function main() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const base = config.yupooSource.replace(/\/$/, '');

  if (imagesOnly && fs.existsSync(OUT_PATH)) {
    const existing = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
    const allowedCats = new Set(
      (existing.categories || [])
        .filter((c) => !isExcludedCategory(c, config))
        .map((c) => c.id)
    );
    const albums = (existing.albums || []).filter((a) =>
      allowedCats.has(a.categoryId)
    );
    existing.categories = (existing.categories || []).filter((c) =>
      allowedCats.has(c.id)
    );
    existing.albums = albums;
    const todo = albums.filter((a) => !a.images?.length);
    console.log(
      `Images-only: ${albums.length} albums, ${todo.length} need image URLs`
    );
    const out = {
      ...existing,
      syncedAt: new Date().toISOString(),
      source: base,
    };
    for (let i = 0; i < todo.length; i++) {
      const a = todo[i];
      try {
        await fetchAlbumImages(base, a);
      } catch (e) {
        console.warn('Album images failed', a.id, e.message);
      }
      if ((i + 1) % 20 === 0) {
        console.log(`  ${i + 1}/${todo.length} (saved checkpoint pending)`);
      }
      if ((i + 1) % SAVE_EVERY === 0) {
        out.syncedAt = new Date().toISOString();
        writeCatalog(out);
        console.log(`  checkpoint saved at ${i + 1}/${todo.length}`);
      }
      await sleep(320);
    }
    out.syncedAt = new Date().toISOString();
    writeCatalog(out);
    const withImg = albums.filter((a) => a.images?.length).length;
    console.log(`Done. ${withImg}/${albums.length} albums have image lists.`);
    return;
  }

  console.log('Fetching categories from', base);
  const homeHtml = await fetchText(`${base}/albums/`);
  const categories = parseCategories(homeHtml);
  console.log(`Found ${categories.length} categories`);

  const albums = [];
  const seen = new Set();

  const visibleCategories = categories
    .filter((c) => !isExcludedCategory(c, config))
    .map((c) => ({ ...c, name: sanitizeCatalogText(c.name) }));

  for (const cat of visibleCategories) {
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
          title: sanitizeCatalogText((a.title || '').trim()),
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

  const out = {
    syncedAt: new Date().toISOString(),
    source: base,
    categories: visibleCategories,
    albums,
  };

  if (withImages) {
    console.log(`Fetching images for ${albums.length} albums...`);
    for (let i = 0; i < albums.length; i++) {
      const a = albums[i];
      try {
        await fetchAlbumImages(base, a);
      } catch (e) {
        console.warn('Album images failed', a.id, e.message);
      }
      if ((i + 1) % 20 === 0) console.log(`  ${i + 1}/${albums.length}`);
      if ((i + 1) % SAVE_EVERY === 0) {
        out.syncedAt = new Date().toISOString();
        writeCatalog(out);
        console.log(`  checkpoint saved at ${i + 1}/${albums.length}`);
      }
      await sleep(320);
    }
  }

  out.syncedAt = new Date().toISOString();
  writeCatalog(out);
  console.log(`Wrote ${albums.length} albums -> ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
