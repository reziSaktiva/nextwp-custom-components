import type { Templates } from "@/lib/nextwp/utils/get-template";
import { DefaultPageTemplate } from "./page/default";
import { ContactPageTemplate } from "./page/contact";
import { DefaultPostTemplate } from "./post/default";
import { PostArchive } from "./archive/default";
import { ExampleTaxonomyTemplate } from "./taxonomy/any-term";

const templates: Templates = {
  page: {
    default: DefaultPageTemplate,
    contact: ContactPageTemplate,
  },
  post: {
    default: DefaultPostTemplate,
  },
  archive: {
    posts: PostArchive,
  },
  taxonomy: {
    category: ExampleTaxonomyTemplate,
    tag: ExampleTaxonomyTemplate,
  },
};

export default templates;
