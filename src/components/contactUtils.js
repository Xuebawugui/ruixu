export function contactHref(type, value) {
  if (!value) return null;
  const v = value.trim();
  if (type === 'whatsapp' || type?.startsWith('whatsapp')) {
    const digits = v.replace(/[^\d+]/g, '');
    return `https://wa.me/${digits.replace(/^\+/, '')}`;
  }
  if (v.startsWith('http')) return v;
  return null;
}

function normalizeWhatsAppList(contacts) {
  const raw = contacts?.whatsapp;
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list.map((s) => String(s).trim()).filter(Boolean);
}

/** 仅 WhatsApp（可多个）+ WeChat */
export function contactEntries(contacts) {
  const entries = [];
  const whatsapps = normalizeWhatsAppList(contacts);

  whatsapps.forEach((num, index) => {
    entries.push({
      key: `whatsapp-${index}`,
      type: 'whatsapp',
      label: 'W/A',
      value: num,
      showValue: true,
    });
  });

  const wechat = contacts?.wechat?.trim();
  if (wechat) {
    entries.push({
      key: 'wechat',
      type: 'wechat',
      label: 'WeChat',
      value: wechat,
      showValue: true,
      copy: true,
    });
  }

  return entries;
}
