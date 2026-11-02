export function filterAlbumsByQuery(albums, rawQuery) {
  const q = (rawQuery || '').trim().toLowerCase();
  if (!q) return albums;
  return albums.filter((a) => {
    const title = (a.title || '').toLowerCase();
    const cat = (a.categoryName || '').toLowerCase();
    return title.includes(q) || cat.includes(q);
  });
}

export function paginateAlbums(albums, page, pageSize) {
  const total = albums.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: albums.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    total,
  };
}
