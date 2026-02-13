import type { Metadata } from "next";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import Gallery from "@/components/common/Gallery";
import { GALLERY_IMAGES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Eindrücke vom Reiterhof Mandy Kolatka — Bilder von unserem Hof, den Pferden und dem Reitunterricht in Zwenkau.",
};

export default function Galerie() {
  return (
    <>
      {/* Header */}
      <section className="bg-beige pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Eindrücke</p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">Galerie</h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              Entdecken Sie Bilder von unserem Hof, unseren Pferden und dem Reitunterricht am Zwenkauer See.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Gallery */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Gallery images={GALLERY_IMAGES} showFilters />
        </div>
      </section>
    </>
  );
}
