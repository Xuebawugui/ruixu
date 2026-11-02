import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider.jsx';

export default function LanguageSelect() {
  const { locale, languages, setLocale } = useI18n();
  const [open, setOpen] = useState(false);

  const current = languages.find((l) => l.code === locale) || languages[0];

  return (
    <div
      className={`lang-select${open ? ' lang-select--open' : ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="lang-select__trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="lang-select__globe" aria-hidden="true">
          🌐
        </span>
        <span className="lang-select__current">{current.label}</span>
        <span className="lang-select__caret" aria-hidden="true" />
      </button>
      <ul className="lang-select__menu" role="listbox">
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              type="button"
              role="option"
              aria-selected={lang.code === locale}
              className={`lang-select__option${
                lang.code === locale ? ' lang-select__option--active' : ''
              }`}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
            >
              {lang.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
