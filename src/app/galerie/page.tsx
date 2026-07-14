import type { Metadata } from "next";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import Gallery from "@/components/common/Gallery";
import { getGalleryImages, getGalleryPageContent } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const page = getGalleryPageContent();
  return buildPageMetadata(page.seo, {
    title: page.title,
    description: page.intro,
  });
}

export default function Galerie() {
  const page = getGalleryPageContent();
  const images = getGalleryImages();

  return (
    <>
      <section className="bg-beige pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
              {page.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              {page.title}
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl">{page.intro}</p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Gallery
            images={images}
            showFilters
            categoryLabels={page.categoryLabels}
            emptyState={page.emptyState}
          />
        </div>
      </section>
    </>
  );
}
