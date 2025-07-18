export function stripWpUrl(url: string): string {
  if (!url) return url;

  const wpUrl = process.env.NEXT_PUBLIC_WP_URL;
  if (!wpUrl) return url;

  return url.replace(wpUrl, "");
}
