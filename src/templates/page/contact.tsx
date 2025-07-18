"use client";
import Script from "next/script";
import type { WpPage } from "@/lib/nextwp/types";

interface ContactPageTemplateProps {
  uri: string;
  data: WpPage;
}

export function ContactPageTemplate({ uri, data }: ContactPageTemplateProps) {
  console.log("Contact page data:", data);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">
        {data?.title?.rendered || "Contact"}
      </h1>

      {/* WPForms Scripts - adjust URLs to your WordPress site */}
      <Script
        src="https://your-wordpress-site.com/wp-content/plugins/wpforms-lite/assets/js/frontend/wpforms.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://your-wordpress-site.com/wp-content/plugins/wpforms-lite/assets/js/frontend/wpforms-min.js"
        strategy="beforeInteractive"
      />

      {/* WPForms CSS */}
      <link
        rel="stylesheet"
        href="https://your-wordpress-site.com/wp-content/plugins/wpforms-lite/assets/css/frontend/classic/wpforms-full.css"
      />

      <div className="prose max-w-none">
        {data?.content?.rendered && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: data.content.rendered }}
            suppressHydrationWarning
          />
        )}
      </div>
    </div>
  );
}
