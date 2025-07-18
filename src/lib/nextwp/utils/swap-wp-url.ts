export function swapWpUrl(url: string): string {
  if (!url) return url;

  const wpUrl = process.env.NEXT_PUBLIC_WP_URL;
  const siteUrl = process.env.NEXT_SITE_URL;

  if (!wpUrl || !siteUrl) return url;

  return url.replace(wpUrl, siteUrl);
}
