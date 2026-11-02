import { useI18n } from '../i18n/I18nProvider.jsx';
import { contactEntries, contactHref } from './contactUtils.js';

export default function ContactBanner({ contacts, highlight = '' }) {
  const { t } = useI18n();
  const items = contactEntries(contacts);
  if (items.length === 0) return null;

  return (
    <div
      id="contact"
      className="contact-banner"
      role="region"
      aria-label={t('contact.region')}
    >
      <div className="contact-banner__inner">
        {highlight ? (
          <span className="contact-banner__highlight" aria-hidden="true">
            {highlight}
          </span>
        ) : null}
        <p className="contact-banner__line">
          {items.map((item, index) => {
            const href = item.copy ? null : contactHref(item.type, item.value);
            const text = item.showValue
              ? `${item.label}: ${item.value.trim()}`
              : item.label;

            return (
              <span key={item.key} className="contact-banner__item">
                {index > 0 ? (
                  <span className="contact-banner__sep" aria-hidden="true">
                    {' '}
                  </span>
                ) : null}
                {item.copy ? (
                  <button
                    type="button"
                    className="contact-banner__link contact-banner__btn"
                    onClick={() => {
                      navigator.clipboard?.writeText(item.value.trim());
                      alert(t('wechatCopied', { id: item.value.trim() }));
                    }}
                  >
                    {text}
                  </button>
                ) : href ? (
                  <a
                    className="contact-banner__link"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {text}
                  </a>
                ) : (
                  <span className="contact-banner__text">{text}</span>
                )}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
