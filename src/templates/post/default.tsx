import type { WpPage } from "@/lib/nextwp/types";
import { Comments, CommentCount } from "@/components/comments";

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
        <div className="flex items-center gap-4 text-gray-600">
          {data?.date && (
            <time dateTime={data.date}>
              {new Date(data.date).toLocaleDateString()}
            </time>
          )}
          {data?.id && <CommentCount postId={data.id} />}
        </div>
      </header>

      <div className="prose max-w-none">
        {data?.content?.rendered && (
          <div
            dangerouslySetInnerHTML={{ __html: data.content.rendered }}
            suppressHydrationWarning
          />
        )}
      </div>

      {/* Comments Section */}
      {data?.id && <Comments postId={data.id} />}
    </article>
  );
}
