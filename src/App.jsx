import { useEffect, useMemo, useState } from 'react';
import {
  Link,
  Route,
  Routes,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import AlbumGrid from './components/AlbumGrid.jsx';
import ContactBanner from './components/ContactBanner.jsx';
import LanguageSelect from './components/LanguageSelect.jsx';
import Pagination from './components/Pagination.jsx';
import SiteNav, { PAGE_SIZE } from './components/SiteNav.jsx';
import { useI18n } from './i18n/I18nProvider.jsx';
import { filterCatalog } from './utils/catalogFilter.js';
import { filterAlbumsByQuery, paginateAlbums } from './utils/filterAlbums.js';
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
        if (!r.ok) throw new Error('missing catalog');
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

function useCatalogStats(albums) {
  return useMemo(() => {
    const countByCategory = {};
    for (const a of albums) {
      countByCategory[a.categoryId] = (countByCategory[a.categoryId] || 0) + 1;
    }
    return { countByCategory };
  }, [albums]);
}

function Header({ config, catalog, countByCategory }) {
  const { t } = useI18n();

  return (
    <header className="site-header-wrap">
      <div className="site-header">
        <div className="site-header__inner">
          <span className="site-header__title">{config.siteName}</span>
          <LanguageSelect />
        </div>
      </div>
      <ContactBanner
        contacts={config.contacts}
        highlight={config.contactHighlight ?? ''}
      />
      <p className="site-notice">{t('notice')}</p>
      <SiteNav
        config={config}
        categories={catalog.categories || []}
        countByCategory={countByCategory}
      />
    </header>
  );
}

function AlbumListPage({ titleKey, albumsSource, basePath }) {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || '1') || 1;
  const q = searchParams.get('q') || '';

  const filtered = useMemo(
    () => filterAlbumsByQuery(albumsSource, q),
    [albumsSource, q]
  );
  const { items, totalPages, total, page: safePage } = paginateAlbums(
    filtered,
    page,
    PAGE_SIZE
  );

  return (
    <main className="page">
      <div className="toolbar">
        <h1 className="page-title">{t(titleKey)}</h1>
        <span className="toolbar__meta">
          {t('common.albumsTotal', { count: total })}
        </span>
      </div>
      <AlbumGrid albums={items} />
      <Pagination
        page={safePage}
        totalPages={totalPages}
        basePath={basePath}
        query={q}
      />
    </main>
  );
}

function Home({ catalog }) {
  return (
    <AlbumListPage
      titleKey="home.title"
      albumsSource={catalog.albums}
      basePath="/"
    />
  );
}

function AlbumsPage({ catalog }) {
  return (
    <AlbumListPage
      titleKey="albums.title"
      albumsSource={catalog.albums}
      basePath="/albums"
    />
  );
}

function SearchPage({ catalog }) {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').trim();
  const page = Number(searchParams.get('page') || '1') || 1;

  const filtered = useMemo(
    () => filterAlbumsByQuery(catalog.albums, q),
    [catalog.albums, q]
  );
  const { items, totalPages, total, page: safePage } = paginateAlbums(
    filtered,
    page,
    PAGE_SIZE
  );

  return (
    <main className="page">
      <nav className="breadcrumb">
        <Link to="/">{t('common.breadcrumbHome')}</Link>
        <span>/</span>
        <span>{t('common.breadcrumbSearch')}</span>
      </nav>
      <div className="toolbar">
        <h1 className="page-title">
          {q ? t('search.titleQuery', { q }) : t('search.title')}
        </h1>
        <span className="toolbar__meta">
          {t('search.results', { count: total })}
        </span>
      </div>
      {!q ? (
        <p className="muted">{t('search.hint')}</p>
      ) : (
        <>
          <AlbumGrid albums={items} />
          <Pagination
            page={safePage}
            totalPages={totalPages}
            basePath="/search"
            query={q}
          />
        </>
      )}
    </main>
  );
}

function CategoryPage({ catalog }) {
  const { t } = useI18n();
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || '1') || 1;
  const q = searchParams.get('q') || '';

  const category = catalog.categories.find((c) => c.id === categoryId);
  const inCategory = useMemo(
    () => catalog.albums.filter((a) => a.categoryId === categoryId),
    [catalog.albums, categoryId]
  );

  const filtered = useMemo(
    () => filterAlbumsByQuery(inCategory, q),
    [inCategory, q]
  );
  const { items, totalPages, total, page: safePage } = paginateAlbums(
    filtered,
    page,
    PAGE_SIZE
  );

  if (!category) {
    return (
      <main className="page">
        <p>{t('category.notFound')}</p>
        <Link to="/">{t('album.backHome')}</Link>
      </main>
    );
  }

  return (
    <main className="page">
      <nav className="breadcrumb">
        <Link to="/">{t('common.breadcrumbHome')}</Link>
        <span>/</span>
        <span>{category.name}</span>
      </nav>
      <div className="toolbar">
        <h1 className="page-title">{category.name}</h1>
        <div className="toolbar__right">
          <span className="toolbar__meta">
            {t('category.count', { count: total })}
          </span>
          <input
            className="search-input"
            type="search"
            placeholder={t('category.searchPlaceholder')}
            value={q}
            onChange={(e) => {
              const v = e.target.value;
              const next = new URLSearchParams();
              if (v) next.set('q', v);
              next.set('page', '1');
              setSearchParams(next);
            }}
          />
        </div>
      </div>
      <AlbumGrid albums={items} />
      <Pagination
        page={safePage}
        totalPages={totalPages}
        basePath={`/category/${categoryId}`}
        query={q}
      />
    </main>
  );
}

function AlbumPage({ catalog }) {
  const { t } = useI18n();
  const { albumId } = useParams();
  const album = catalog.albums.find((a) => a.id === albumId);

  if (!album) {
    return (
      <main className="page">
        <p>{t('album.notFound')}</p>
        <Link to="/">{t('album.backHome')}</Link>
      </main>
    );
  }

  const images = album.images && album.images.length > 0 ? album.images : [];
  const displayImages =
    images.length > 0 ? images : album.cover ? [album.cover] : [];
  const needsFullSync = images.length === 0 && album.photoCount > 1;

  return (
    <main className="page">
      <nav className="breadcrumb">
        <Link to="/">{t('common.breadcrumbHome')}</Link>
        <span>/</span>
        <Link to={`/category/${album.categoryId}`}>{album.categoryName}</Link>
        <span>/</span>
        <span>{album.title}</span>
      </nav>
      <h1 className="page-title album-detail-title">{album.title}</h1>
      <p className="album-detail-hint">
        {t('album.orderHint', { title: album.title })}
      </p>
      {needsFullSync ? (
        <p className="muted">{t('album.syncFullHint')}</p>
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
  const { t } = useI18n();
  const { config, catalog, error, loading } = useSiteData();
  const visibleCatalog = useMemo(
    () =>
      catalog && config
        ? filterCatalog(catalog, config)
        : { albums: [], categories: [] },
    [catalog, config]
  );
  const { countByCategory } = useCatalogStats(visibleCatalog.albums);

  if (loading) {
    return <div className="loading-screen">{t('common.loading')}</div>;
  }

  if (error || !config) {
    return (
      <div className="loading-screen error">
        <p>{error || t('common.loadFailed')}</p>
        <p className="muted">{t('common.syncHint')}</p>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="loading-screen error">
        <p>{t('common.needSync')}</p>
        <code>npm run sync</code>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header
        config={config}
        catalog={visibleCatalog}
        countByCategory={countByCategory}
      />
      <Routes>
        <Route path="/" element={<Home catalog={visibleCatalog} />} />
        <Route path="/albums" element={<AlbumsPage catalog={visibleCatalog} />} />
        <Route path="/search" element={<SearchPage catalog={visibleCatalog} />} />
        <Route
          path="/category/:categoryId"
          element={<CategoryPage catalog={visibleCatalog} />}
        />
        <Route
          path="/album/:albumId"
          element={<AlbumPage catalog={visibleCatalog} />}
        />
      </Routes>
    </div>
  );
}
