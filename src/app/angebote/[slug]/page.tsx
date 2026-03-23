import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Users, Layers3 } from "lucide-react";
import MarkdownContent from "@/components/common/MarkdownContent";
import ScrollReveal from "@/components/common/ScrollReveal";
import InquiryButton from "@/components/ui/InquiryButton";
import SectionDivider from "@/components/ui/SectionDivider";
import { getOfferBySlug, getOffers } from "@/lib/content";

export function generateStaticParams() {
  return getOffers().map((offer) => ({ slug: offer.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const offer = getOfferBySlug(slug);

  if (!offer) {
    return { title: "Angebot nicht gefunden" };
  }

  return {
    title: `${offer.title} - See-Pferde Zwenkau`,
    description: offer.description,
  };
}

export default async function AngebotDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offer = getOfferBySlug(slug);

  if (!offer) notFound();

  return (
    <>
      <section className="relative h-[50vh] min-h-[350px] flex items-end">
        <Image
          src={offer.imageSrc}
          alt={offer.imageAlt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D2A35]/70 via-[#3D2A35]/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <ScrollReveal>
            <Link
              href="/angebote"
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Alle Angebote
            </Link>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white drop-shadow-lg">
              {offer.title}
            </h1>
            <p className="mt-3 text-lg text-cream/90 max-w-2xl">
              {offer.summary}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ScrollReveal>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                  {offer.category === "seminar" ? "Seminar & Coaching" : "Workshop"}
                </p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">
                  Das erwartet Sie
                </h2>
                <MarkdownContent className="text-text-secondary text-lg leading-relaxed">
                  {offer.body}
                </MarkdownContent>
              </ScrollReveal>
            </div>

            <div>
              <ScrollReveal delay={120}>
                <div className="bg-cream rounded-2xl p-6 border border-brown/8 space-y-5">
                  <div className="flex items-start gap-3">
                    <Layers3 className="w-5 h-5 text-forest mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-text text-sm">Format</p>
                      <p className="text-text-secondary">
                        {offer.format ?? "Individuell abstimmbar"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-forest mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-text text-sm">Teilnehmer</p>
                      <p className="text-text-secondary">
                        {offer.participantCount ?? "Nach Bedarf planbar"}
                      </p>
                    </div>
                  </div>

                  {offer.specialNote && (
                    <div className="rounded-xl bg-white p-4 border border-brown/8">
                      <p className="font-semibold text-text text-sm mb-1">
                        Besonderheit
                      </p>
                      <p className="text-text-secondary">{offer.specialNote}</p>
                    </div>
                  )}

                  {offer.prerequisites && (
                    <div className="rounded-xl bg-white p-4 border border-brown/8">
                      <p className="font-semibold text-text text-sm mb-1">
                        Voraussetzungen
                      </p>
                      <p className="text-text-secondary">{offer.prerequisites}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-beige py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                Auf einen Blick
              </p>
              <h2 className="text-3xl sm:text-4xl">Highlights</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offer.highlights.map((highlight, index) => (
              <ScrollReveal key={highlight} delay={index * 80}>
                <div className="flex items-start gap-3 bg-white rounded-xl p-5 border border-brown/8">
                  <CheckCircle2 className="w-5 h-5 text-forest mt-0.5 shrink-0" />
                  <p className="text-text-secondary leading-relaxed">
                    {highlight}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {offer.audience && offer.audience.length > 0 && (
        <>
          <section className="bg-white py-20 md:py-28">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <div className="text-center mb-10">
                  <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                    Für wen?
                  </p>
                  <h2 className="text-3xl sm:text-4xl">Teilnehmerkreis</h2>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {offer.audience.map((item, index) => (
                  <ScrollReveal key={item} delay={index * 70}>
                    <div className="bg-cream rounded-xl p-5 border border-brown/8 text-text-secondary">
                      {item}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <section className="bg-[#3D2A35] text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl text-white mb-4">
              Interesse an diesem Angebot?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
              Kontaktieren Sie uns für ein individuelles Angebot oder weitere
              Informationen - wir beraten Sie gern persönlich.
            </p>
            <InquiryButton subject={offer.title} label="Jetzt anfragen" size="lg" />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
