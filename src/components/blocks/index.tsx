import Image from "next/image";
import React from "react";

// Export all block components here
// You can add your custom blocks as needed

export const HeroBlock = () => (
  <div className="bg-blue-500 text-white p-8 text-center">
    <h2>Hero Block</h2>
    <p>This is a hero block component</p>
  </div>
);

export const TextBlock = ({ content }: { content?: string }) => (
  <div className="prose max-w-none">
    <div dangerouslySetInnerHTML={{ __html: content || "" }} />
  </div>
);

export const ImageBlock = ({ image }: { image?: { url: string, alt: string } }) => (
  <div className="my-8">
    {image?.url && (
      <Image
        src={image.url}
        alt={image.alt || ""}
        className="w-full h-auto rounded-lg"
      />
    )}
  </div>
);
