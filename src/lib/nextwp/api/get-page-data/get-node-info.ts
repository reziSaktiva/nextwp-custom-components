import type { PostType } from "../../types";
import { getPostTypes } from "../get-post-types";
import { getSingleItem } from "../get-single-item";
import { getSiteSettings } from "../get-site-settings";
import type { Taxonomy } from "../../types";
import { getTaxonomies } from "../get-taxonomies";

/**
 * Get post type archive and rest base by uri
 */
export async function getNodeInfo(uri: string): Promise<{
  /**
   * The rest base for the post type to be used in the WordPress REST API endpoint.
   */
  rest_base: string;
  /**
   * The post type archive data if this uri is an archive page.
   */
  archive: PostType | undefined;

  /**
   * The taxonomy data if this uri is a taxonomy archive page.
   */
  taxonomy?: Taxonomy;
}> {
  const settings = await getSiteSettings();
  const postTypes = await getPostTypes();
  const taxonomies = await getTaxonomies();

  const paths = uri.split("/");
  const slug = paths.slice(-1).toString();

  let archive: PostType | undefined;
  let taxonomy;
  let rest_base = "pages";

  for (const key in postTypes) {
    const postType = postTypes[key];
    // get rest base for post type
    if (postType.slug && uri.startsWith(postType.slug)) {
      rest_base = postType.rest_base || "posts";
    }
    // check if uri matches a post type archive uri
    if (postType.has_archive === uri) {
      archive = postType;
    }
  }

  for (const key in taxonomies) {
    const taxonomyItem = taxonomies[key];
    if (taxonomyItem.slug && uri.startsWith(taxonomyItem.slug)) {
      taxonomy = taxonomyItem;
      rest_base = taxonomyItem.rest_base || "categories";
      break;
    }
  }

  if (uri.startsWith("tag/")) {
    taxonomy = taxonomies.post_tag;
    rest_base = taxonomy?.rest_base || "tags";
  }

  if (settings.page_for_posts) {
    // need to check if the blog page is the current page because this could be on any uri
    const blogPage = await getSingleItem({
      id: settings.page_for_posts,
      rest_base: "pages",
    });

    if (blogPage?.data?.slug === slug) {
      archive = {
        has_archive: blogPage.data.slug,
        slug: "posts",
        rest_base: "posts",
      };
    }
  }

  return { archive, rest_base, taxonomy };
}
