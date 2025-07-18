import { getAuthHeaders } from "../api/get-auth-headers";

/**
 * Generate static params for all pages and posts
 */
export async function generateStaticParams(): Promise<{ paths: string[] }[]> {
  if (!process.env.NEXT_PUBLIC_WP_URL) {
    return [];
  }

  try {
    // Get all pages
    const pagesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/pages?per_page=100&_fields=slug`,
      {
        headers: getAuthHeaders(),
      }
    );

    // Get all posts
    const postsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/posts?per_page=100&_fields=slug`,
      {
        headers: getAuthHeaders(),
      }
    );

    const pages = await pagesResponse.json();
    const posts = await postsResponse.json();

    const paths: { paths: string[] }[] = [];

    // Add pages
    pages.forEach((page: any) => {
      if (page.slug) {
        paths.push({ paths: [page.slug] });
      }
    });

    // Add posts
    posts.forEach((post: any) => {
      if (post.slug) {
        paths.push({ paths: [post.slug] });
      }
    });

    return paths;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
