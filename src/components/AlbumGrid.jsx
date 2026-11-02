import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { proxyYupooImage } from '../utils/yupooImage.js';

export default function AlbumGrid({ albums }) {
  const { t } = useI18n();

  if (!albums.length) {
    return <p className="empty">{t('common.noAlbums')}</p>;
  }

  return (
    <div className="album-grid">
      {albums.map((a) => (
        <Link key={a.id} to={`/album/${a.id}`} className="album-card">
          <div className="album-card__imgwrap">
            <img src={proxyYupooImage(a.cover)} alt="" loading="lazy" />
            <span className="album-card__badge">
              {t('common.photos', { count: a.photoCount })}
            </span>
          </div>
          <p className="album-card__title">{a.title || `Album ${a.id}`}</p>
        </Link>
      ))}
    </div>
  );
}
