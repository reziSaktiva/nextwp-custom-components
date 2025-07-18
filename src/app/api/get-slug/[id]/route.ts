import { getSlugFromId } from "@/lib/nextwp";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return Response.json({ error: "ID harus berupa angka" }, { status: 400 });
    }

    const searchParams = new URL(request.url).searchParams;
    const rest_base = searchParams.get("type") || "posts";

    const slug = await getSlugFromId({
      id,
      rest_base,
    });

    if (slug) {
      return Response.json({
        id,
        slug,
        rest_base,
        url: `/${slug}`,
      });
    } else {
      return Response.json(
        {
          error: "Post tidak ditemukan",
          id,
          rest_base,
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error getting slug from ID:", error);
    return Response.json(
      {
        error: "Terjadi kesalahan server",
      },
      { status: 500 }
    );
  }
}
