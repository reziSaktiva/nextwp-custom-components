# Cara Mendapatkan Slug dari ID WordPress

## Overview

Fungsi `getSlugFromId` memungkinkan Anda untuk mendapatkan slug dari ID post/page WordPress menggunakan WordPress REST API.

## Fungsi yang Tersedia

### getSlugFromId

```typescript
getSlugFromId({
  id: number,
  rest_base: string
}): Promise<string | null>
```

**Parameters:**

- `id`: ID dari post/page WordPress
- `rest_base`: Jenis post (misalnya: "posts", "pages", "custom-post-type")

**Returns:**

- `string | null`: Slug dari post/page, atau `null` jika tidak ditemukan

## Contoh Penggunaan

### 1. Mendapatkan Slug dari Post ID

```typescript
import { getSlugFromId } from "@/lib/nextwp";

// Mendapatkan slug dari post dengan ID 123
const slug = await getSlugFromId({
  id: 123,
  rest_base: "posts",
});

if (slug) {
  console.log(`Slug: ${slug}`); // Output: "nama-post-saya"
} else {
  console.log("Post tidak ditemukan");
}
```

### 2. Mendapatkan Slug dari Page ID

```typescript
import { getSlugFromId } from "@/lib/nextwp";

// Mendapatkan slug dari page dengan ID 456
const slug = await getSlugFromId({
  id: 456,
  rest_base: "pages",
});

if (slug) {
  console.log(`Slug: ${slug}`); // Output: "tentang-kami"
} else {
  console.log("Page tidak ditemukan");
}
```

### 3. Mendapatkan Slug dari Custom Post Type

```typescript
import { getSlugFromId } from "@/lib/nextwp";

// Mendapatkan slug dari custom post type dengan ID 789
const slug = await getSlugFromId({
  id: 789,
  rest_base: "products", // Ganti dengan nama custom post type Anda
});

if (slug) {
  console.log(`Slug: ${slug}`); // Output: "produk-unggulan"
} else {
  console.log("Produk tidak ditemukan");
}
```

### 4. Penggunaan dalam API Route

```typescript
// app/api/get-slug/[id]/route.ts
import { getSlugFromId } from "@/lib/nextwp";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const searchParams = new URL(request.url).searchParams;
  const rest_base = searchParams.get("type") || "posts";

  const slug = await getSlugFromId({
    id,
    rest_base,
  });

  if (slug) {
    return Response.json({ slug });
  } else {
    return Response.json({ error: "Post tidak ditemukan" }, { status: 404 });
  }
}
```

### 5. Penggunaan dalam Server Component

```typescript
// app/post/[id]/page.tsx
import { getSlugFromId } from "@/lib/nextwp";
import { redirect } from "next/navigation";

export default async function PostPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  // Dapatkan slug dari ID
  const slug = await getSlugFromId({
    id,
    rest_base: "posts",
  });

  if (slug) {
    // Redirect ke URL dengan slug
    redirect(`/post/${slug}`);
  } else {
    // Handle jika post tidak ditemukan
    return <div>Post tidak ditemukan</div>;
  }
}
```

## Error Handling

Fungsi ini akan mengembalikan `null` jika:

1. Post/page dengan ID tersebut tidak ditemukan
2. Terjadi error dalam request ke WordPress API
3. Environment variable `NEXT_PUBLIC_WP_URL` tidak di-set
4. Authentication gagal (jika diperlukan)

## Performance Tips

1. **Cache Results**: Jika Anda sering mengakses slug yang sama, pertimbangkan untuk cache hasilnya
2. **Batch Requests**: Untuk multiple IDs, pertimbangkan untuk membuat batch request
3. **Use Fields Parameter**: Fungsi ini sudah menggunakan `_fields=slug` untuk mengoptimalkan request

## Environment Variables

Pastikan Anda memiliki environment variable berikut:

```env
NEXT_PUBLIC_WP_URL=https://your-wordpress-site.com
WP_APPLICATION_PASSWORD=your-application-password
```

## WordPress REST API Endpoint

Fungsi ini menggunakan endpoint WordPress REST API:

```
GET /wp-json/wp/v2/{rest_base}/{id}?_fields=slug
```

Contoh:

- Posts: `/wp-json/wp/v2/posts/123?_fields=slug`
- Pages: `/wp-json/wp/v2/pages/456?_fields=slug`
- Custom Post Type: `/wp-json/wp/v2/products/789?_fields=slug`
