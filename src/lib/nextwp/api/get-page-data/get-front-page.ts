import type { WpPage } from "../../types";
import { getSiteSettings } from "../get-site-settings";

export async function getFrontPage(): Promise<{ data?: WpPage } | null> {
  try {
    const settings = await getSiteSettings();

    if (settings.page_on_front) {
      // If a static page is set as front page
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/pages/${settings.page_on_front}?_embed=true`,
        {
          headers: {
            Authorization: `Basic ${btoa(
              process.env.WP_APPLICATION_PASSWORD || ""
            )}`,
          },
        }
      );

      if (response.ok) {
        const page = (await response.json()) as WpPage;
        return { data: page };
      }
    }

    // Fallback to latest post
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/posts?_embed=true&per_page=1`,
      {
        headers: {
          Authorization: `Basic ${btoa(
            process.env.WP_APPLICATION_PASSWORD || ""
          )}`,
        },
      }
    );

    if (response.ok) {
      const posts = (await response.json()) as WpPage[];
      if (posts.length > 0) {
        return { data: posts[0] };
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching front page:", error);
    return null;
  }
}
