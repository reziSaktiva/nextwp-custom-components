// nextjs app functions
export { generateMetadata } from "./next-app-functions/generate-meta-data";
export { generateStaticParams } from "./next-app-functions/generate-static-params";

// react components
export { FlexibleContent, type Row } from "./components/flexible-content";
export { WordpressTemplate } from "./components/wordpress-template";

// rest api functions
export { getSiteSettings } from "./api/get-site-settings";
export { getPageData } from "./api/get-page-data/get-page-data";
export { getSingleItem, getSlugFromId } from "./api/get-single-item";

// utils helpers
export { getFeaturedImage } from "./utils/get-featured-image";
export { stripWpUrl } from "./utils/strip-wp-url";
export { swapWpUrl } from "./utils/swap-wp-url";

// types
export type {
  WpPage,
  YoastHeadJson,
  WpLink,
  WpImage,
  AcfImage,
  AcfFile,
  AcfVideo,
  WpSettings,
  WpMenuItem,
  Menu,
  WpMediaItem,
  PostType,
  Taxonomy,
  WpTerm,
  ArchivePageData,
  TaxonomyPageData,
} from "./types";

export type { Templates, TemplateProps } from "./utils/get-template";

export type {
  SearchParams,
  RouteParams,
} from "./components/wordpress-template";
