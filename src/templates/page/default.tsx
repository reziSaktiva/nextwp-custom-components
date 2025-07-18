import { FlexibleContent } from "@/lib/nextwp";
import type { WpPage } from "@/lib/nextwp/types";
import blocks from "@/components/blocks";

type Block = any; // You can define specific block types later
interface PageData extends WpPage {
  acf?: {
    modules?: Block[];
  };
}

export function DefaultPageTemplate({ data }: { data: PageData }) {
  console.log("Full page data:", data);
  console.log("ACF data:", data?.acf);
  console.log("Modules:", data?.acf?.modules);

  // If ACF modules exist, use FlexibleContent
  if (data?.acf?.modules) {
    return <FlexibleContent rows={data.acf.modules as any} blocks={blocks} />;
  }

  // Fallback to regular content
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">
        {data?.title?.rendered || "Page"}
      </h1>
      <div className="prose max-w-none">
        {data?.content?.rendered && (
          <div
            dangerouslySetInnerHTML={{ __html: data.content.rendered }}
            suppressHydrationWarning
          />
        )}
      </div>
    </div>
  );
}
