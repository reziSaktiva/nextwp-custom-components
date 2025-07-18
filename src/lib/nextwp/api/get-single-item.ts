import type { WpPage } from "../types";
import { getAuthHeaders } from "./get-auth-headers";

interface GetSingleItemParams {
  uri?: string;
  id?: number;
  rest_base: string;
}

interface GetSingleItemResponse {
  data?: WpPage;
  previewData?: WpPage;
}

/**
 * Get slug from post ID
 */
export async function getSlugFromId({
  id,
  rest_base,
}: {
  id: number;
  rest_base: string;
}): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_WP_URL) {
    throw new Error("NEXT_PUBLIC_WP_URL environment variable is required");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${rest_base}/${id}?_fields=slug`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      return null;
    }

    const item = await response.json();
    return item.slug || null;
  } catch (error) {
    console.error("Error fetching slug from ID:", error);
    return null;
  }
}

/**
 * Get a single item from WordPress REST API
 */
export async function getSingleItem({
  uri,
  id,
  rest_base,
}: GetSingleItemParams): Promise<GetSingleItemResponse | null> {
  if (!process.env.NEXT_PUBLIC_WP_URL) {
    throw new Error("NEXT_PUBLIC_WP_URL environment variable is required");
  }

  try {
    let url: string;

    if (id) {
      // If ID is provided, fetch by ID
      url = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${rest_base}/${id}?_embed=true`;
    } else if (uri) {
      // If URI is provided, fetch by slug
      url = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${rest_base}?slug=${uri}&_embed=true`;
    } else {
      throw new Error("Either uri or id must be provided");
    }

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      return null;
    }

    if (id) {
      // If fetching by ID, response is a single object
      const item = (await response.json()) as WpPage;
      return {
        data: item,
      };
    } else {
      // If fetching by slug, response is an array
      const items = (await response.json()) as WpPage[];

      if (!items || items.length === 0) {
        return null;
      }

      return {
        data: items[0],
      };
    }
  } catch (error) {
    console.error("Error fetching single item:", error);
    return null;
  }
}
