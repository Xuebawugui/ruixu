/** 去掉 LeeMade 品牌前缀与 Yupoo 标题里的美元/人民币价格块 */
export function sanitizeCatalogText(text) {
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
