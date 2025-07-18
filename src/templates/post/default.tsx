import type { WpPage } from "@/lib/nextwp/types";

interface DefaultPostTemplateProps {
  uri: string;
  data: WpPage;
}

export function DefaultPostTemplate({ uri, data }: DefaultPostTemplateProps) {
  console.log("Post data:", data);

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {data?.title?.rendered || "Post"}
        </h1>
        {data?.date && (
          <time className="text-gray-600" dateTime={data.date}>
            {new Date(data.date).toLocaleDateString()}
          </time>
        )}
      </header>

      <div className="prose max-w-none">
        {data?.content?.rendered && (
          <div
            dangerouslySetInnerHTML={{ __html: data.content.rendered }}
            suppressHydrationWarning
          />
        )}
      </div>
    </article>
  );
}
