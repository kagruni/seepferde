import type { Metadata } from "next";
import Image from "next/image";
import { CircleCheck } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import InquiryButton from "@/components/ui/InquiryButton";
import SectionDivider from "@/components/ui/SectionDivider";
import {
  getAccommodationPageContent,
  getOffers,
  getOffersPageContent,
} from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const page = getOffersPageContent();
  return buildPageMetadata(page.seo, {
    title: page.title,
    description: page.intro,
  });
}

export default function Angebote() {
  const page = getOffersPageContent();
  const accommodation = getAccommodationPageContent();
  const offers = getOffers();
  const groups = [
    {
      category: "seminar" as const,
      eyebrow: page.seminarEyebrow,
      title: page.seminarTitle,
      background: "bg-white",
    },
    {
      category: "workshop" as const,
      eyebrow: page.workshopEyebrow,
      title: page.workshopTitle,
      background: "bg-beige",
    },
  ];

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

      {groups.map((group) => {
        const groupOffers = offers.filter((offer) => offer.category === group.category);
        return (
          <section key={group.category} className={`${group.background} py-16 md:py-24`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <div className="mb-10">
                  <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                    {group.eyebrow}
                  </p>
                  <h2 className="text-3xl sm:text-4xl">{group.title}</h2>
                </div>
              </ScrollReveal>

              {groupOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  {groupOffers.map((offer, index) => (
                    <ScrollReveal key={offer.slug} delay={index * 100} className="h-full">
                      <Card
                        imageSrc={offer.imageSrc}
                        imageAlt={offer.imageAlt}
                        title={offer.title}
                        description={offer.summary}
                        href={`/angebote/${offer.slug}`}
                      >
                        <p className="mt-4 text-forest font-semibold text-sm">
                          Mehr erfahren →
                        </p>
                      </Card>
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl bg-cream/70 p-6 text-text-secondary">
                  In diesem Bereich sind aktuell keine Angebote veröffentlicht.
                </p>
              )}
            </div>
          </section>
        );
      })}

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <ScrollReveal>
            <div className="relative min-h-80 overflow-hidden rounded-2xl shadow-sm lg:min-h-[30rem]">
              <Image
                src={accommodation.imageSrc}
                alt={accommodation.imageAlt}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
              {accommodation.eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl">{accommodation.title}</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
              {accommodation.intro}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Unterbringungsmöglichkeiten">
              {accommodation.options.map((option) => (
                <li key={option.title} className="flex items-start gap-2 text-text-secondary">
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-forest" aria-hidden="true" />
                  <span>
                    <strong className="text-text">{option.title}:</strong> {option.price}
                  </span>
                </li>
              ))}
            </ul>
            <Button href="/pferdeunterbringung" variant="primary" className="mt-8">
              Details zur Unterbringung
            </Button>
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
