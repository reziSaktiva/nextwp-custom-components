import type { PostType } from "../../types";
import type { ArchivePageData } from "../../types";

export async function getArchivePage({
  archive,
  pageNumber,
}: {
  archive: PostType;
  pageNumber: number;
}): Promise<{ data?: ArchivePageData; archive?: PostType }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${archive.rest_base}?_embed=true&page=${pageNumber}&per_page=10`,
      {
        headers: {
          Authorization: `Basic ${btoa(
            process.env.WP_APPLICATION_PASSWORD || ""
          )}`,
        },
      }
    );

    if (response.ok) {
      const items = (await response.json()) as any[];
      const total = parseInt(response.headers.get("X-WP-Total") || "0", 10);
      const totalPages = parseInt(
        response.headers.get("X-WP-TotalPages") || "0",
        10
      );

      return {
        archive,
        data: {
          items,
          total,
          totalPages,
          currentPage: pageNumber,
          hasNextPage: pageNumber < totalPages,
          hasPreviousPage: pageNumber > 1,
          nextPage: pageNumber < totalPages ? pageNumber + 1 : 0,
          previousPage: pageNumber > 1 ? pageNumber - 1 : 0,
        } as ArchivePageData,
      };
    }

    return { archive };
  } catch (error) {
    console.error("Error fetching archive page:", error);
    return { archive };
  }
}
