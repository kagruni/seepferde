import type { Metadata } from "next";
import ScrollReveal from "@/components/common/ScrollReveal";
import Card from "@/components/ui/Card";
import InquiryButton from "@/components/ui/InquiryButton";
import SectionDivider from "@/components/ui/SectionDivider";
import { getOffers } from "@/lib/content";

export const metadata: Metadata = {
  title: "Unsere Angebote",
  description:
    "Pferdegestütztes Coaching, Teambuilding, Workshops und Erlebnistage - entdecken Sie unser vielfältiges Angebot auf dem Reiterhof Mandy Kolatka.",
};

export default function Angebote() {
  const offers = getOffers();
  const seminars = offers.filter((offer) => offer.category === "seminar");
  const workshops = offers.filter((offer) => offer.category === "workshop");

  return (
    <>
      <section className="bg-beige pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
              Unser Angebot
            </p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              Unsere Angebote
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              Pferdegestütztes Coaching, Teambuilding und einzigartige Workshops
              - entdecken Sie unsere vielfältigen Angebote für Unternehmen,
              Teams und Einzelpersonen.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-10">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                Für Unternehmen & Teams
              </p>
              <h2 className="text-3xl sm:text-4xl">Seminare & Coaching</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {seminars.map((offer, index) => (
              <ScrollReveal key={offer.slug} delay={index * 100} className="h-full">
                <Card
                  imageSrc={offer.imageSrc}
                  imageAlt={offer.imageAlt}
                  title={offer.title}
                  description={offer.summary}
                  href={`/angebote/${offer.slug}`}
                >
                  <p className="mt-4 text-forest font-semibold text-sm hover:text-forest-dark transition-colors">
                    Mehr erfahren →
                  </p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-beige py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-10">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                Für Reiter & Pferdebegeisterte
              </p>
              <h2 className="text-3xl sm:text-4xl">Workshops & Training</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {workshops.map((offer, index) => (
              <ScrollReveal key={offer.slug} delay={index * 100} className="h-full">
                <Card
                  imageSrc={offer.imageSrc}
                  imageAlt={offer.imageAlt}
                  title={offer.title}
                  description={offer.summary}
                  href={`/angebote/${offer.slug}`}
                >
                  <p className="mt-4 text-forest font-semibold text-sm hover:text-forest-dark transition-colors">
                    Mehr erfahren →
                  </p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl text-white mb-4">
              Interesse? Kontaktieren Sie uns
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
              Wir erstellen Ihnen gerne ein individuelles Angebot - passend zu
              Ihren Wünschen und Ihrem Team.
            </p>
            <InquiryButton label="Angebot anfragen" size="lg" />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
