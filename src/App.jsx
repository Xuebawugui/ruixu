import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useParams, useSearchParams } from 'react-router-dom';
import ContactBanner from './components/ContactBanner.jsx';
import { proxyYupooImage } from './utils/yupooImage.js';
import './App.css';

function useSiteData() {
  const [config, setConfig] = useState(null);
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/site-config.json').then((r) => r.json()),
      fetch('/data/catalog.json').then((r) => {
        if (!r.ok) throw new Error('缺少 catalog.json，请先运行 npm run sync');
        return r.json();
      }),
    ])
      .then(([cfg, cat]) => {
        setConfig(cfg);
        setCatalog(cat);
      })
      .catch((e) => setError(e.message));
  }, []);

  return {
    config,
    catalog,
    error,
    loading: !config && !catalog && !error,
  };
}

function Header({ config }) {
  return (
    <header className="site-header-wrap">
      <div className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-brand">
            <span className="site-brand__name">{config.siteName}</span>
            <span className="site-brand__tag">{config.tagline}</span>
          </Link>
        </div>
      </div>
      <ContactBanner
        contacts={config.contacts}
        highlight={config.contactHighlight ?? '🔥'}
      />
      {config.notice ? (
        <p className="site-notice">{config.notice}</p>
      ) : null}
    </header>
  );
}

function Home({ catalog }) {
  const categories = catalog.categories || [];
  const countByCategory = useMemo(() => {
    const m = {};
    for (const a of catalog.albums) {
      m[a.categoryId] = (m[a.categoryId] || 0) + 1;
    }
    return m;
  }, [catalog.albums]);

  return (
    <main className="page">
      <h1 className="page-title">产品分类</h1>
      <ul className="category-list">
        {categories.map((c) => {
          const count = countByCategory[c.id] || 0;
          return (
            <li key={c.id}>
              <Link to={`/category/${c.id}`} className="category-card">
                <span className="category-card__name">{c.name}</span>
                <span className="category-card__count">{count} 款</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

function CategoryPage({ catalog }) {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').trim().toLowerCase();

  const category = catalog.categories.find((c) => c.id === categoryId);
  const albums = useMemo(() => {
    let list = catalog.albums.filter((a) => a.categoryId === categoryId);
    if (q) {
      list = list.filter((a) => (a.title || '').toLowerCase().includes(q));
    }
    return list;
  }, [catalog.albums, categoryId, q]);

  if (!category) {
    return (
      <main className="page">
        <p>分类不存在</p>
        <Link to="/">返回首页</Link>
      </main>
    );
  }

  return (
    <main className="page">
      <nav className="breadcrumb">
        <Link to="/">首页</Link>
        <span>/</span>
        <span>{category.name}</span>
      </nav>
      <div className="toolbar">
        <h1 className="page-title">{category.name}</h1>
        <input
          className="search-input"
          type="search"
          placeholder="搜索款号 / 标题…"
          value={searchParams.get('q') || ''}
          onChange={(e) => {
            const v = e.target.value;
            if (v) setSearchParams({ q: v });
            else setSearchParams({});
          }}
        />
      </div>
      <div className="album-grid">
        {albums.map((a) => (
          <Link key={a.id} to={`/album/${a.id}`} className="album-card">
            <div className="album-card__imgwrap">
              <img
                src={proxyYupooImage(a.cover)}
                alt=""
                loading="lazy"
              />
              <span className="album-card__badge">{a.photoCount} 图</span>
            </div>
            <p className="album-card__title">{a.title || `Album ${a.id}`}</p>
          </Link>
        ))}
      </div>
      {albums.length === 0 ? <p className="empty">没有匹配的相册</p> : null}
    </main>
  );
}

function AlbumPage({ catalog }) {
  const { albumId } = useParams();
  const album = catalog.albums.find((a) => a.id === albumId);

  if (!album) {
    return (
      <main className="page">
        <p>相册不存在</p>
        <Link to="/">返回首页</Link>
      </main>
    );
  }

  const images = album.images && album.images.length > 0 ? album.images : [];
  const displayImages =
    images.length > 0 ? images : album.cover ? [album.cover] : [];
  const needsFullSync =
    images.length === 0 && album.photoCount > 1;

  return (
    <main className="page">
      <nav className="breadcrumb">
        <Link to="/">首页</Link>
        <span>/</span>
        <Link to={`/category/${album.categoryId}`}>{album.categoryName}</Link>
        <span>/</span>
        <span>{album.title}</span>
      </nav>
      <h1 className="page-title album-detail-title">{album.title}</h1>
      <p className="album-detail-hint">
        喜欢这款？截图联系客服下单（Item / 标题：{album.title}）
      </p>
      {needsFullSync ? (
        <p className="muted">
          本地仅缓存封面。发布前在项目里执行 <code>npm run sync:full</code>{' '}
          可拉取该相册全部图片。
        </p>
      ) : null}
      <div className="photo-grid">
        {displayImages.map((src) => (
          <a
            key={src}
            className="photo-grid__item"
            href={src}
            target="_blank"
            rel="noreferrer"
          >
            <img src={proxyYupooImage(src)} alt="" loading="lazy" />
          </a>
        ))}
      </div>
    </main>
  );
}

export default function App() {
  const { config, catalog, error, loading } = useSiteData();

  if (loading) {
    return <div className="loading-screen">加载中…</div>;
  }

  if (error || !config) {
    return (
      <div className="loading-screen error">
        <p>{error || '加载失败'}</p>
        <p className="muted">在项目目录执行：npm install && npm run sync</p>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="loading-screen error">
        <p>请先同步产品数据</p>
        <code>npm run sync</code>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header config={config} />
      <Routes>
        <Route path="/" element={<Home catalog={catalog} />} />
        <Route
          path="/category/:categoryId"
          element={<CategoryPage catalog={catalog} />}
        />
        <Route
          path="/album/:albumId"
          element={<AlbumPage catalog={catalog} />}
        />
      </Routes>
    </div>
  );
}
