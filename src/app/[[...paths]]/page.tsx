import { WordpressTemplate } from "@/lib/nextwp";
import { generateMetadata as generateWpMetadata } from "@/lib/nextwp";
import templates from "@/templates";

export default async function PageRoute(props: any) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  return (
    <WordpressTemplate
      params={params}
      searchParams={searchParams}
      templates={templates}
    />
  );
}

export async function generateMetadata(props: any) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  return generateWpMetadata({
    params,
    searchParams,
  });
}

export { generateStaticParams } from "@/lib/nextwp";
