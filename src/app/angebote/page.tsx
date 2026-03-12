import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import InquiryButton from "@/components/ui/InquiryButton";

export const metadata: Metadata = {
  title: "Unsere Angebote",
  description: "Pferdegestütztes Coaching, Teambuilding, Workshops und Erlebnistage — entdecken Sie unser vielfältiges Angebot auf dem Reiterhof Mandy Kolatka.",
};

const SEMINARE = [
  {
    title: "Coaching für Führungskräfte",
    description: "Pferdegestütztes Leadership-Coaching — Pferde als Spiegel für Führungsverhalten.",
    imageSrc: "/images/angebote/fuehrungskraefte-coaching.jpeg",
    imageAlt: "Pferdegestütztes Führungskräfte-Coaching auf dem Reiterhof",
    href: "/angebote/fuehrungskraefte-coaching",
  },
  {
    title: "Teambuilding",
    description: "Pferdegestütztes Teambuilding — das Pferd als neues Teammitglied.",
    imageSrc: "/images/angebote/teambuilding.jpeg",
    imageAlt: "Teambuilding mit Pferden auf dem Reiterhof",
    href: "/angebote/teambuilding",
  },
  {
    title: "Raus aus dem Alltag – rein ins Erleben!",
    description: "Kreativer Erlebnistag — Teamgeist stärken durch gemeinsames Erleben.",
    imageSrc: "/images/angebote/erlebnistag.jpeg",
    imageAlt: "Erlebnistag auf dem Reiterhof",
    href: "/angebote/erlebnistag",
  },
];

const WORKSHOPS = [
  {
    title: "Extreme-Trail",
    description: "Erster Extreme-Trail Park in Sachsen! Vertrauen aufbauen für Mensch und Pferd.",
    imageSrc: "/images/angebote/extreme-trail.jpeg",
    imageAlt: "Extreme-Trail Park mit natürlichen Hindernissen",
    href: "/angebote/extreme-trail",
  },
  {
    title: "Working-Equitation",
    description: "Motivations-Parcours für Pferd und Reiter — Dressur trifft Trail.",
    imageSrc: "/images/angebote/working-equitation.jpeg",
    imageAlt: "Working-Equitation Parcours",
    href: "/angebote/working-equitation",
  },
  {
    title: "Garrocha",
    description: "Traditionelle südeuropäische Reitkunst — Motivation und Freude.",
    imageSrc: "/images/angebote/garrocha.jpeg",
    imageAlt: "Garrocha — Reiten mit der traditionellen Stange",
    href: "/angebote/garrocha",
  },
];

export default function Angebote() {
  return (
    <>
      {/* Header */}
      <section className="bg-beige pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Unser Angebot</p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">Unsere Angebote</h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              Pferdegestütztes Coaching, Teambuilding und einzigartige Workshops — entdecken Sie unsere vielfältigen Angebote für Unternehmen, Teams und Einzelpersonen.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Seminare & Coaching */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-10">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Für Unternehmen & Teams</p>
              <h2 className="text-3xl sm:text-4xl">Seminare & Coaching</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {SEMINARE.map((angebot, i) => (
              <ScrollReveal key={angebot.title} delay={i * 100} className="h-full">
                <Card
                  imageSrc={angebot.imageSrc}
                  imageAlt={angebot.imageAlt}
                  title={angebot.title}
                  description={angebot.description}
                  href={angebot.href}
                >
                  <p className="mt-4 text-forest font-semibold text-sm hover:text-forest-dark transition-colors">Mehr erfahren →</p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Workshops & Training */}
      <section className="bg-beige py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-10">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Für Reiter & Pferdebegeisterte</p>
              <h2 className="text-3xl sm:text-4xl">Workshops & Training</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {WORKSHOPS.map((angebot, i) => (
              <ScrollReveal key={angebot.title} delay={i * 100} className="h-full">
                <Card
                  imageSrc={angebot.imageSrc}
                  imageAlt={angebot.imageAlt}
                  title={angebot.title}
                  description={angebot.description}
                  href={angebot.href}
                >
                  <p className="mt-4 text-forest font-semibold text-sm hover:text-forest-dark transition-colors">Mehr erfahren →</p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* CTA */}
      <section className="bg-forest text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl text-white mb-4">Interesse? Kontaktieren Sie uns</h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
              Wir erstellen Ihnen gerne ein individuelles Angebot — passend zu Ihren Wünschen und Ihrem Team.
            </p>
            <InquiryButton label="Angebot anfragen" size="lg" />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
