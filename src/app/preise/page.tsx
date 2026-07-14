import type { Metadata } from "next";
import { Info } from "lucide-react";
import PriceCard from "@/components/ui/PriceCard";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import InquiryButton from "@/components/ui/InquiryButton";
import { getPrices, getPricesPageContent } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const page = getPricesPageContent();
  return buildPageMetadata(page.seo, {
    title: page.title,
    description: page.intro,
  });
}

export default function Preise() {
  const page = getPricesPageContent();
  const prices = getPrices();

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
          {prices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {prices.map((price, index) => (
                <ScrollReveal key={price.slug} delay={index * 100} className="h-full">
                  <PriceCard {...price} className="h-full" />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-beige p-8 text-center text-text-secondary">
              {page.companyNote}
            </p>
          )}

          <ScrollReveal delay={200}>
            <div className="mt-12 bg-beige rounded-2xl p-6 md:p-8 flex gap-4 items-start">
              <Info className="w-6 h-6 text-gold shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold mb-1">{page.disclaimerTitle}</h2>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {page.disclaimerBody}
                </p>
                <p className="mt-3 text-text-secondary text-sm leading-relaxed">
                  {page.companyNote}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {page.ctaTitle && page.ctaLabel ? (
        <section className="bg-[#3D2A35] text-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl text-white mb-4">{page.ctaTitle}</h2>
              {page.ctaBody ? (
                <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
                  {page.ctaBody}
                </p>
              ) : null}
              <InquiryButton label={page.ctaLabel} size="lg" />
            </ScrollReveal>
          </div>
        </section>
      ) : null}
    </>
  );
}
