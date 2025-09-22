/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import Image from "next/image";
import type { TemplateProps } from "@/lib/nextwp/utils/get-template";
import type { ArchivePageData } from "@/lib/nextwp/types";
import { getFeaturedImage } from "@/lib/nextwp";

interface BlogArchiveData extends Omit<ArchivePageData, "items"> {
  items?: any[];
}

interface BlogArchive extends Omit<TemplateProps, "data"> {
  data: BlogArchiveData;
}

export function PostArchive(props: BlogArchive) {
  const {
    data: {
      items,
      currentPage,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
    },
    uri,
  } = props;

  // Get base path from current URI
  const basePath = uri.replace(/\/page\/\d+$/, "") || "/blogs";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items?.map((post: any) => {
          const featuredImage = getFeaturedImage(post);
          console.log("featuredImage", featuredImage);

          return (
            <article
              className="flex flex-col items-start justify-between border rounded-lg p-6 hover:shadow-lg transition-shadow"
              key={post.id}
            >
              <div className="relative w-full aspect-[16/9] mb-4">
                {featuredImage?.url ? (
                  <Image
                    alt={post.title?.rendered || "Post image"}
                    className="rounded-lg object-cover"
                    fill
                    src={featuredImage.url}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>

              <div className="w-full">
                <div className="flex items-center gap-x-4 text-xs mb-3">
                  <time className="text-gray-500" dateTime={post.date || ""}>
                    {post.date ? new Date(post.date).toLocaleDateString() : ""}
                  </time>
                </div>

                <div className="group relative">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600 mb-3">
                    <Link href={new URL(post.link).pathname}>
                      <span className="absolute inset-0" />
                      {post.title?.rendered}
                    </Link>
                  </h3>

                  {post.excerpt?.rendered && (
                    <div
                      className="line-clamp-3 text-sm leading-6 text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt.rendered,
                      }}
                    />
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination */}
      {(hasNextPage || hasPreviousPage) && (
        <div className="flex justify-between items-center mt-8 pt-8 border-t">
          <div>
            {hasPreviousPage && (
              <Link
                href={
                  previousPage === 1
                    ? basePath
                    : `${basePath}/page/${previousPage}`
                }
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Previous
              </Link>
            )}
          </div>

          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <div>
            {hasNextPage && (
              <Link
                href={`${basePath}/page/${nextPage}`}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
