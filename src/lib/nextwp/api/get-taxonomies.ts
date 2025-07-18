import type { Taxonomy } from "../types";
import { getAuthHeaders } from "./get-auth-headers";

/**
 * Get all taxonomies from WordPress
 */
export async function getTaxonomies(): Promise<Record<string, Taxonomy>> {
  if (!process.env.NEXT_PUBLIC_WP_URL) {
    throw new Error("NEXT_PUBLIC_WP_URL environment variable is required");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/taxonomies`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      return {};
    }

    const taxonomies = (await response.json()) as Record<string, Taxonomy>;
    return taxonomies;
  } catch (error) {
    console.error("Error fetching taxonomies:", error);
    return {};
  }
}
