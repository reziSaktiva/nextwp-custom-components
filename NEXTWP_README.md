# NextWP Implementation

This project includes a custom implementation of NextWP components and utilities without requiring the `@nextwp/core` package installation.

## Features

- **Server Side Generation (SSG)**: Pre-render content from WordPress in your Next.js app
- **Dynamic Routing**: Handle all WordPress pages and posts with a single dynamic route
- **SEO Support**: Generate metadata using YoastSEO data from WordPress
- **Flexible Content**: Render ACF flexible content fields
- **TypeScript Support**: Full type safety for WordPress data

## Project Structure

```
src/
├── lib/nextwp/                    # NextWP implementation
│   ├── components/                # React components
│   │   ├── wordpress-template.tsx # Main template component
│   │   └── flexible-content.tsx   # ACF flexible content renderer
│   ├── api/                       # WordPress API functions
│   │   ├── get-site-settings.ts   # Fetch site settings
│   │   ├── get-single-item.ts     # Fetch individual pages/posts
│   │   └── get-page-data/         # Page data fetching logic
│   ├── utils/                     # Utility functions
│   │   ├── get-template.ts        # Template selection logic
│   │   ├── debug-log.ts           # Debug logging
│   │   └── ...
│   ├── types.ts                   # TypeScript type definitions
│   └── index.ts                   # Main exports
├── templates/                     # Page templates
│   ├── index.ts                   # Template configuration
│   ├── default-template.tsx       # Default template
│   ├── page-template.tsx          # Page template
│   └── post-template.tsx          # Post template
└── app/[[...paths]]/              # Dynamic route
    └── page.tsx                   # Main page component
```

## Setup

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```bash
# WordPress Configuration
NEXT_PUBLIC_WP_URL=https://your-wordpress-site.com
NEXT_SITE_URL=http://localhost:3000

# WordPress Authentication
WP_APPLICATION_PASSWORD=your-application-password

# Next.js Configuration
NEXT_PREVIEW_SECRET=your-preview-secret
REVALIDATE_SECRET_KEY=your-revalidate-secret
```

### 2. WordPress Setup

Ensure your WordPress site has:

- **REST API enabled** (default in WordPress 4.7+)
- **YoastSEO plugin** (for SEO metadata)
- **Advanced Custom Fields** (for flexible content)
- **Application Password** created for authentication

### 3. Application Password

1. Go to WordPress Admin → Users → Your Profile
2. Scroll down to "Application Passwords"
3. Create a new application password
4. Copy the generated password to your `.env.local` file

## Usage

### Basic Setup

The main dynamic route is already configured in `src/app/[[...paths]]/page.tsx`:

```tsx
import { WordpressTemplate } from "@/lib/nextwp";
import { templates } from "@/templates";

export default function PageTemplate(props: any) {
  return (
    <WordpressTemplate
      params={props.params}
      searchParams={props.searchParams}
      templates={templates}
    />
  );
}

export { generateMetadata, generateStaticParams } from "@/lib/nextwp";
```

### Templates

Templates are configured in `src/templates/index.ts`:

```tsx
export const templates = {
  page: {
    default: PageTemplate,
  },
  post: {
    default: PostTemplate,
  },
  archive: {
    post: DefaultTemplate,
  },
  taxonomy: {
    category: DefaultTemplate,
    tag: DefaultTemplate,
  },
};
```

### Creating Custom Templates

1. Create a new template component:

```tsx
import type { TemplateProps } from "@/lib/nextwp/utils/get-template";

export function CustomTemplate({ data, uri }: TemplateProps) {
  return (
    <div>
      <h1>{data?.title?.rendered}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: data?.content?.rendered || "" }}
      />
    </div>
  );
}
```

2. Add it to the templates configuration:

```tsx
export const templates = {
  page: {
    default: PageTemplate,
    custom: CustomTemplate, // Add your custom template
  },
  // ...
};
```

### Flexible Content

To use ACF flexible content:

```tsx
import { FlexibleContent } from "@/lib/nextwp";

// Define your flexible content blocks
const blocks = {
  HeroSection: HeroSectionComponent,
  ContentBlock: ContentBlockComponent,
  // ... more blocks
};

// In your template
<FlexibleContent blocks={blocks} rows={data?.acf?.flexible_content} />;
```

### API Functions

You can use the API functions directly:

```tsx
import { getSiteSettings, getPageData } from "@/lib/nextwp";

// Get site settings
const settings = await getSiteSettings();

// Get page data
const pageData = await getPageData("/about");
```

## Available Components

### WordpressTemplate

The main component that handles WordPress page rendering.

**Props:**

- `params`: Route parameters
- `templates`: Template configuration
- `searchParams`: Search parameters
- `supressWarnings`: Suppress development warnings

### FlexibleContent

Renders ACF flexible content fields.

**Props:**

- `blocks`: Object of React components
- `rows`: Array of flexible content rows
- `data`: Extra data to pass to components
- `supressWarnings`: Suppress warnings

## Available Functions

### generateMetadata

Generates Next.js metadata from WordPress YoastSEO data.

### generateStaticParams

Generates static paths for all WordPress pages and posts.

### getSiteSettings

Fetches WordPress site settings.

### getPageData

Fetches data for a specific page based on URI.

### getSingleItem

Fetches a single WordPress item by slug.

## TypeScript Types

All WordPress data types are available:

```tsx
import type {
  WpPage,
  WpSettings,
  WpMenuItem,
  ArchivePageData,
} from "@/lib/nextwp";
```

## Development

### Debug Mode

Enable debug logging by setting `NODE_ENV=development`. The system will log:

- Missing templates
- Missing flexible content components
- API errors

### Customization

You can customize the implementation by:

1. **Modifying API functions** in `src/lib/nextwp/api/`
2. **Adding new utilities** in `src/lib/nextwp/utils/`
3. **Creating custom components** in `src/lib/nextwp/components/`
4. **Extending types** in `src/lib/nextwp/types.ts`

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Ensure your application password is correct and the user has proper permissions.

2. **Missing Templates**: Check that your template is properly configured in `src/templates/index.ts`.

3. **Flexible Content Not Rendering**: Verify that your ACF field is set to "Show in REST API".

4. **SEO Metadata Missing**: Ensure YoastSEO plugin is installed and configured.

### Environment Variables

Make sure all required environment variables are set:

- `NEXT_PUBLIC_WP_URL`: Your WordPress site URL
- `WP_APPLICATION_PASSWORD`: Your WordPress application password
- `NEXT_SITE_URL`: Your Next.js site URL

## Next Steps

1. Configure your WordPress site with the required plugins
2. Set up your environment variables
3. Create custom templates for your specific needs
4. Add flexible content blocks for dynamic layouts
5. Customize the styling to match your design

This implementation provides all the core functionality of NextWP without requiring the external package, giving you full control over the codebase and the ability to customize it to your specific needs.
