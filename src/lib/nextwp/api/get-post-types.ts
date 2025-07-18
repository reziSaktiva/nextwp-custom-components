import type { PostType } from "../types";
import { getAuthHeaders } from "./get-auth-headers";

/**
 * Get all post types from WordPress
 */
export async function getPostTypes(): Promise<Record<string, PostType>> {
  if (!process.env.NEXT_PUBLIC_WP_URL) {
    throw new Error("NEXT_PUBLIC_WP_URL environment variable is required");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/types`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      return {};
    }

    const postTypes = (await response.json()) as Record<string, PostType>;
    return postTypes;
  } catch (error) {
    console.error("Error fetching post types:", error);
    return {};
  }
}
