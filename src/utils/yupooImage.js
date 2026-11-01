export function proxyYupooImage(url) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('photo.yupoo.com') && !url.includes('photo3.yupoo.com')) {
    return url;
  }
  return `/api/yupoo-image?url=${encodeURIComponent(url)}`;
}
