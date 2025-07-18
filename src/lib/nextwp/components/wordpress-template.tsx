import React from "react";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import type { WpPage } from "../types";
import type { ArchivePageData } from "../types";
import { deepMerge } from "../utils/deep-merge";
import type { Templates } from "../utils/get-template";
import { getTemplate } from "../utils/get-template";
import { getPageData } from "../api/get-page-data/get-page-data";

export type SearchParams = Record<string, string | string[] | undefined>;
export type RouteParams = { paths?: string[] };

/**
 * This component is the main entry point for rendering a WordPress page.
 * It will fetch the data for the page and render the appropriate template.
 * It also handles preview mode.
 */
export async function WordpressTemplate({
  params,
  templates,
  searchParams,
  supressWarnings,
  ...rest
}: {
  params?: RouteParams;
  templates: Templates;
  searchParams?: SearchParams;
  supressWarnings?: boolean;
}) {
  const uri = params?.paths?.join("/") || "/";
  const { isEnabled } = await draftMode();

  // Check for new preview format: /{slug}?secret={NEXT_PREVIEW_SECRET}&preview=true
  const isNewPreviewFormat =
    searchParams?.preview === "true" && searchParams?.secret;
  const isValidPreviewSecret =
    searchParams?.secret === process.env.NEXT_PREVIEW_SECRET;

  // Determine if we're in preview mode
  const isPreviewMode =
    isEnabled || (isNewPreviewFormat && isValidPreviewSecret);

  const { data, archive, previewData, taxonomy, term } = await getPageData(
    uri,
    searchParams
  );

  if (!data && !previewData && !archive && !taxonomy && !term) {
    notFound();
  }

  const PageTemplate = getTemplate({
    uri,
    data,
    archive,
    taxonomy,
    term,
    templates,
    supressWarnings,
  });

  if (!PageTemplate) {
    notFound();
  }

  let mergedData = data;
  if (previewData && mergedData) {
    mergedData = deepMerge<WpPage | ArchivePageData>(mergedData, previewData);
  }

  return (
    <PageTemplate
      archive={archive}
      data={mergedData}
      isPreview={Boolean(isPreviewMode)}
      params={params}
      searchParams={searchParams}
      taxonomy={taxonomy}
      term={term}
      uri={uri}
      {...rest}
    />
  );
}
