import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';

export default function Pagination({ page, totalPages, basePath, query = '' }) {
  const { t } = useI18n();

  if (totalPages <= 1) return null;

  const mk = (p) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('page', String(p));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 ? (
        <Link to={mk(page - 1)} className="pagination__btn">
          {t('pagination.prev')}
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--disabled">
          {t('pagination.prev')}
        </span>
      )}
      <span className="pagination__info">
        {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link to={mk(page + 1)} className="pagination__btn">
          {t('pagination.next')}
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--disabled">
          {t('pagination.next')}
        </span>
      )}
    </nav>
  );
}
