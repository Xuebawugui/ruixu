import { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';

const PAGE_SIZE = 48;

export { PAGE_SIZE };

export default function SiteNav({ config, categories, countByCategory }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(urlQ);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const shortName =
    config.siteShortName ||
    config.siteName?.split(/\s+/)[0] ||
    'Shop';

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')),
    [categories]
  );

  function submitSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      navigate('/albums');
      return;
    }
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="site-nav">
      <div className="site-nav__top">
        <Link to="/" className="site-nav__brand">
          {shortName}
        </Link>
        <form className="site-nav__search" onSubmit={submitSearch}>
          <input
            type="search"
            className="site-nav__search-input"
            placeholder={t('nav.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="site-nav__search-btn">
            {t('nav.search')}
          </button>
        </form>
      </div>
      <nav className="site-nav__menu" aria-label="Main">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `site-nav__link${isActive ? ' site-nav__link--active' : ''}`
          }
          end
        >
          {t('nav.home')}
        </NavLink>
        <NavLink
          to="/albums"
          className={({ isActive }) =>
            `site-nav__link${isActive ? ' site-nav__link--active' : ''}`
          }
        >
          {t('nav.albums')}
        </NavLink>
        <a className="site-nav__link" href="#contact">
          {t('nav.contact')}
        </a>
        <div
          className={`site-nav__dropdown${categoriesOpen ? ' site-nav__dropdown--open' : ''}`}
          onMouseEnter={() => setCategoriesOpen(true)}
          onMouseLeave={() => setCategoriesOpen(false)}
        >
          <button
            type="button"
            className="site-nav__link site-nav__dropdown-trigger"
            aria-expanded={categoriesOpen}
            onClick={() => setCategoriesOpen((v) => !v)}
          >
            {t('nav.allCategories')}
            <span className="site-nav__caret" aria-hidden="true" />
          </button>
          <div className="site-nav__dropdown-panel">
            <ul className="site-nav__category-list">
              {sortedCategories.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/category/${c.id}`}
                    className="site-nav__category-item"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    <span className="site-nav__category-name">{c.name}</span>
                    <span className="site-nav__category-count">
                      {countByCategory[c.id] || 0}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
