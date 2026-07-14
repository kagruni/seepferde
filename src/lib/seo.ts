import type { Metadata } from "next";

interface SeoFields {
  title?: string;
  description?: string;
  socialImage?: string;
  socialImageAlt?: string;
  noIndex?: boolean;
}

interface MetadataFallbacks {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export function buildPageMetadata(
  seo: SeoFields | undefined,
  fallbacks: MetadataFallbacks
): Metadata {
  const title = seo?.title || fallbacks.title;
  const description = seo?.description || fallbacks.description;
  const image = seo?.socialImage || fallbacks.image;
  const imageAlt = seo?.socialImageAlt || fallbacks.imageAlt || title;

  return {
    title,
    description,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image, alt: imageAlt }] : undefined,
    },
  };
}
