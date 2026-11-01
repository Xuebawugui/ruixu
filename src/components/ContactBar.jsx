import { contactEntries, contactHref } from './contactUtils.js';

export default function ContactBar({ contacts }) {
  const items = contactEntries(contacts);

  return (
    <aside className="contact-bar" aria-label="联系方式">
      <div className="contact-bar__inner">
        <span className="contact-bar__label">联系下单</span>
        <div className="contact-bar__actions">
          {items.map((item) => {
            const href = item.copy ? null : contactHref(item.type, item.value);
            if (item.copy) {
              return (
                <button
                  key={item.key}
                  type="button"
                  className="contact-chip"
                  onClick={() => {
                    navigator.clipboard?.writeText(item.value.trim());
                    alert(`已复制 ${item.label}：${item.value.trim()}`);
                  }}
                >
                  {item.label}: {item.value}
                </button>
              );
            }
            return (
              <a
                key={item.key}
                className="contact-chip contact-chip--link"
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
