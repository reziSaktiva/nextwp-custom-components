import type { Metadata } from "next";
import { getSiteSettings } from "../api/get-site-settings";
import { getPageData } from "../api/get-page-data/get-page-data";
import { swapWpUrl } from "../utils/swap-wp-url";

interface GenerateMetadataParams {
  params?: {
    paths?: string[];
  };
  wpUrl: string;
}

/**
 * This function uses YoastSEO data from WordPress to generate metadata in Next.js.
 * It should be exported from your dynamic route `src/app/[[...paths]]/page.tsx` file.
 */
export async function generateMetadata({
  params: rawParams,
  searchParams,
  wpUrl = process.env.NEXT_PUBLIC_WP_URL || "",
}: {
  params: Promise<{ paths?: string[] }> | { paths?: string[] };
  searchParams?: Record<string, string | string[] | undefined>;
  wpUrl?: string;
}): Promise<Metadata> {
  if (!wpUrl) {
    throw new Error(
      "No wpUrl provided. Please set NEXT_PUBLIC_WP_URL env or pass wpUrl to generateMetadata"
    );
  }

  handleRequiredEnvs();

  const params = await rawParams; // ✅ Await the params here
  const uri = params?.paths?.join("/") || "/";
  const siteSettings = await getSiteSettings();
  const { data, archive } = await getPageData(uri, searchParams);

  const yoast =
    data?.yoast_head_json || // seo data for single items (pages,posts,custom post type singles)
    archive?.yoast_head_json; // seo data for the archive
  console.log("yoast", yoast?.canonical);
  return {
    generator: "nextwp.org",
    applicationName: decodeHtmlEntities(siteSettings.title),
    metadataBase: new URL(wpUrl),
    title: decodeHtmlEntities(yoast?.title),
    description: decodeHtmlEntities(yoast?.og_description),

    openGraph: {
      title: decodeHtmlEntities(yoast?.og_title),
      description: decodeHtmlEntities(yoast?.og_description),
      siteName: decodeHtmlEntities(yoast?.og_site_name),
      locale: yoast?.og_locale,
      url: swapWpUrl(yoast?.og_url ?? ""),
      type: getValidOpenGraphType(yoast?.og_type),
      images: yoast?.og_image
        ? yoast.og_image
            .map((img: any) => ({
              url: img.url,
              width: img.width,
              height: img.height,
              alt: img.alt,
            }))
            .filter((img: any) => img.url)
        : [],
    },

    twitter: {
      card:
        (yoast?.twitter_card as
          | "summary"
          | "summary_large_image"
          | "player"
          | "app") || undefined,
      title: decodeHtmlEntities(yoast?.twitter_title),
      description: decodeHtmlEntities(yoast?.twitter_description),
      images: yoast?.twitter_image ? [yoast.twitter_image] : undefined,
      creator: yoast?.twitter_creator,
      site: yoast?.twitter_site,
    },

    other: {
      ...(yoast?.keywords && { keywords: yoast.keywords }),
      ...(yoast?.robots && { robots: yoast.robots }),
      ...(yoast?.canonical && { canonical: swapWpUrl(yoast.canonical) }),
      ...(yoast?.alternateLanguages && {
        alternateLanguages: yoast.alternateLanguages,
      }),
      ...(yoast?.article_published_time && {
        "article:published_time": yoast.article_published_time,
      }),
      ...(yoast?.article_modified_time && {
        "article:modified_time": yoast.article_modified_time,
      }),
      ...(yoast?.article_author && { "article:author": yoast.article_author }),
      ...(yoast?.article_section && {
        "article:section": yoast.article_section,
      }),
      ...(yoast?.article_tag && { "article:tag": yoast.article_tag }),
      ...(yoast?.og_updated_time && {
        "og:updated_time": yoast.og_updated_time,
      }),
      ...(yoast?.og_image_width && { "og:image:width": yoast.og_image_width }),
      ...(yoast?.og_image_height && {
        "og:image:height": yoast.og_image_height,
      }),
      ...(yoast?.og_image_alt && { "og:image:alt": yoast.og_image_alt }),
      ...(yoast?.twitter_image_alt && {
        "twitter:image:alt": yoast.twitter_image_alt,
      }),
      ...(yoast?.twitter_image_width && {
        "twitter:image:width": yoast.twitter_image_width,
      }),
      ...(yoast?.twitter_image_height && {
        "twitter:image:height": yoast.twitter_image_height,
      }),
    },
  };
}

function decodeHtmlEntities(str?: string): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function handleRequiredEnvs() {
  if (!process.env.WP_APPLICATION_PASSWORD) {
    throw new Error(`'WP_APPLICATION_PASSWORD' environment variable is required for function 'generateMetaData'.

Check your ${
      process.env.NODE_ENV === "development"
        ? "local .env file"
        : "deployment's environment variables."
    }.

You can generate an application password in your WordPress admin under Users > Your Profile > Application Passwords.
Make sure the user has the required permissions to view site settings.

${
  process.env.NEXT_PUBLIC_WP_URL
    ? `See ${process.env.NEXT_PUBLIC_WP_URL}/wp-admin/profile.php#application-passwords-section`
    : ""
}`);
  }
}

function getValidOpenGraphType(
  type?: string
): "website" | "article" | "book" | "profile" {
  if (
    type === "website" ||
    type === "article" ||
    type === "book" ||
    type === "profile"
  ) {
    return type;
  }
  return "website"; // Default to website if type is invalid or undefined
}
