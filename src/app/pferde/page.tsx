import type { Metadata } from "next";
import ScrollReveal from "@/components/common/ScrollReveal";
import HorseProfile from "@/components/common/HorseProfile";
import Button from "@/components/ui/Button";
import SectionDivider from "@/components/ui/SectionDivider";
import { getHorses, getHorsesPageContent } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const page = getHorsesPageContent();
  return buildPageMetadata(page.seo, {
    title: page.title,
    description: page.intro,
  });
}

export default function Pferde() {
  const page = getHorsesPageContent();
  const horses = getHorses();

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

      <SectionDivider variant="horse" />

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {horses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {horses.map((horse, index) => (
                <ScrollReveal key={horse.slug} delay={index * 100} className="h-full">
                  <HorseProfile horse={horse} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-beige p-8 text-center text-text-secondary" role="status">
              {page.emptyState}
            </p>
          )}

          <ScrollReveal delay={200}>
            <aside className="mt-14 rounded-2xl border border-brown/12 bg-beige p-8 text-center md:p-10">
              <h2 className="text-2xl sm:text-3xl mb-3">{page.closingTitle}</h2>
              <p className="mx-auto max-w-2xl text-text-secondary leading-relaxed">
                {page.closingBody}
              </p>
              <Button href="/kontakt" variant="primary" className="mt-6">
                {page.closingCtaLabel}
              </Button>
            </aside>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
