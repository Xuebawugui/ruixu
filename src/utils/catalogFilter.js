/** 隐藏指定分类（如原站的 About Us / 旧联系方式相册） */
export function filterCatalog(catalog, config) {
  if (!catalog) return catalog;

  const excludeIds = new Set(config?.excludeCategoryIds || []);
  const patterns = (config?.excludeCategoryNameIncludes || []).map((s) =>
    s.toLowerCase()
  );

  const categories = (catalog.categories || []).filter((c) => {
    if (excludeIds.has(c.id)) return false;
    if (!patterns.length) return true;
    const name = (c.name || '').toLowerCase();
    return !patterns.some((p) => name.includes(p));
  });

  const allowed = new Set(categories.map((c) => c.id));
  const albums = (catalog.albums || []).filter((a) => allowed.has(a.categoryId));

  return { ...catalog, categories, albums };
}
