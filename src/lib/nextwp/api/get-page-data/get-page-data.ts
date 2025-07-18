import type { WpPage } from "../../types";
import { getSingleItem } from "../get-single-item";
import type { TaxonomyPageData } from "../../types";
import type { PostType } from "../../types";
import type { Taxonomy } from "../../types";
import type { WpTerm } from "../../types";
import { getFrontPage } from "./get-front-page";
import { getNodeInfo } from "./get-node-info";
import type { ArchivePageData } from "../../types";
import { getArchivePage } from "./get-archive-page";
import type { SearchParams } from "../../components/wordpress-template";
import { getAuthHeaders } from "../get-auth-headers";

type PageData = {
  data?: WpPage | ArchivePageData | TaxonomyPageData;
  previewData?: WpPage;
  archive?: PostType;
  taxonomy?: Taxonomy;
  term?: WpTerm;
};

/**
 * Get data for a specific page from a WordPress REST API endpoint based on the URI
 */
export async function getPageData(
  uri: string,
  searchParams?: SearchParams
): Promise<PageData> {
  if (uri === "/" || uri === "index") {
    const frontPage = await getFrontPage();
    return frontPage || {};
  }

  const { uriWithoutPage, pageNumber } = extractPageNumberFromUri(uri);
  const { rest_base, archive, taxonomy } = await getNodeInfo(uriWithoutPage);

  if (archive) {
    return getArchivePage({
      archive,
      pageNumber,
    });
  }
  if (taxonomy) {
    return getTaxonomyPage({
      uri: uriWithoutPage,
      taxonomy,
      pageNumber,
    });
  }

  const singleItem = await getSingleItem({
    uri: uriWithoutPage,
    rest_base,
  });

  if (singleItem?.data) {
    // Check if we need to fetch preview data for the new format
    if (
      searchParams?.preview === "true" &&
      searchParams?.secret === process.env.NEXT_PREVIEW_SECRET
    ) {
      const previewData = await getPreviewData(uriWithoutPage, rest_base);
      if (previewData) {
        return {
          ...singleItem,
          previewData,
        };
      }
    }
    return singleItem;
  }

  // posts are a special case because they can have an empty slug prefix like pages
  const possiblePostItem = await getSingleItem({
    uri: uriWithoutPage,
    rest_base: "posts",
  });

  if (possiblePostItem?.data) {
    // Check if we need to fetch preview data for the new format
    if (
      searchParams?.preview === "true" &&
      searchParams?.secret === process.env.NEXT_PREVIEW_SECRET
    ) {
      const previewData = await getPreviewData(uriWithoutPage, "posts");
      if (previewData) {
        return {
          ...possiblePostItem,
          previewData,
        };
      }
    }
    return possiblePostItem;
  }

  // If no published post found but we're in preview mode, try to get draft data
  if (
    searchParams?.preview === "true" &&
    searchParams?.secret === process.env.NEXT_PREVIEW_SECRET
  ) {
    const previewData = await getPreviewData(uriWithoutPage, rest_base);
    if (previewData) {
      return {
        data: previewData,
        previewData: undefined,
      };
    }

    // Try posts as well
    const postPreviewData = await getPreviewData(uriWithoutPage, "posts");
    if (postPreviewData) {
      return {
        data: postPreviewData,
        previewData: undefined,
      };
    }
  }

  return {
    data: undefined,
    previewData: undefined,
    archive: undefined,
    taxonomy: undefined,
    term: undefined,
  };
}

/**
 * Get preview data for a draft post
 */
async function getPreviewData(
  uri: string,
  rest_base: string
): Promise<WpPage | null> {
  try {
    if (!process.env.NEXT_PUBLIC_WP_URL) {
      throw new Error("NEXT_PUBLIC_WP_URL environment variable is required");
    }

    // Fetch draft data with authentication
    const url = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${rest_base}?slug=${uri}&_embed=true&status=draft,pending,private`;

    const response = await fetch(url, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const items = (await response.json()) as WpPage[];

    if (!items || items.length === 0) {
      return null;
    }

    return items[0];
  } catch (error) {
    console.error("Error fetching preview data:", error);
    return null;
  }
}

function extractPageNumberFromUri(uri: string): {
  uriWithoutPage: string;
  pageNumber: number;
} {
  const pageMatch = uri.match(/\/page\/(\d+)$/);
  if (pageMatch) {
    return {
      uriWithoutPage: uri.replace(/\/page\/\d+$/, ""),
      pageNumber: parseInt(pageMatch[1], 10),
    };
  }
  return {
    uriWithoutPage: uri,
    pageNumber: 1,
  };
}

async function getTaxonomyPage({
  uri,
  taxonomy,
  pageNumber,
}: {
  uri: string;
  taxonomy: Taxonomy;
  pageNumber: number;
}): Promise<PageData> {
  // Simplified implementation - you would need to implement the full taxonomy page logic
  return {
    taxonomy,
    data: {
      items: [],
      total: 0,
      totalPages: 0,
      currentPage: pageNumber,
      hasNextPage: false,
      hasPreviousPage: false,
      nextPage: 0,
      previousPage: 0,
    } as TaxonomyPageData,
  };
}
