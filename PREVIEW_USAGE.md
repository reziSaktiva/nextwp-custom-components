# WordPress Draft Preview Usage

## Overview

This Next.js WordPress integration now supports previewing draft posts using a direct URL format. The preview functionality works by fetching draft data from WordPress when the correct secret is provided in the URL.

## New Preview Format

You can now preview draft posts using this URL format:

```
/{slug}?secret={NEXT_PREVIEW_SECRET}&preview=true
```

### Example

If you have a draft post with slug `my-draft-post` and your `NEXT_PREVIEW_SECRET` is `my-secret-123`, you can access the preview at:

```
/my-draft-post?secret=my-secret-123&preview=true
```

## Environment Variables Required

Make sure you have these environment variables set in your `.env.local` file:

```env
# WordPress Configuration
NEXT_PUBLIC_WP_URL=https://your-wordpress-site.com

# WordPress Authentication
WP_APPLICATION_PASSWORD=your-application-password

# Next.js Configuration
NEXT_PREVIEW_SECRET=your-preview-secret
```

## How It Works

1. When a user visits a URL with `?secret={NEXT_PREVIEW_SECRET}&preview=true`, the system:

   - Validates the secret against the `NEXT_PREVIEW_SECRET` environment variable
   - Fetches the draft post data from WordPress using authentication
   - Renders the preview with the draft content
   - Sets the `isPreview` flag to `true` for the template

2. The system will:
   - First try to find a published post with the given slug
   - If found, merge the published data with any draft updates
   - If no published post exists, show only the draft data
   - Support both pages and posts

## Security

- The `NEXT_PREVIEW_SECRET` must match exactly
- Only users with the correct secret can access draft previews
- The secret should be kept private and not exposed in client-side code
- Authentication with WordPress is required to fetch draft data

## Fallback

If the new preview format doesn't work, the original API route `/api/draft/preview` is still available as a fallback.

## Notes

- This implementation doesn't use Next.js draft mode to avoid compatibility issues
- Preview state is determined by URL parameters and secret validation
- Draft data is fetched using WordPress REST API with authentication
