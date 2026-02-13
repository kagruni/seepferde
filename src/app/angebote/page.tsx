import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Unsere Angebote",
  description: "Reitunterricht, Ponyreiten, Longenstunden und Schnupperstunden — entdecken Sie unser vielfältiges Angebot auf dem Reiterhof Mandy Kolatka.",
};

const ANGEBOTE = [
  {
    title: "Reitunterricht",
    description: "Von der ersten Longenstunde bis zum selbstständigen Reiten. Einzel- und Gruppenunterricht für Anfänger und Fortgeschrittene.",
    imageSrc: "/images/angebote/reitunterricht-anfaenger.jpeg",
    imageAlt: "Anfängerin im Reitunterricht",
    href: "/angebote/reitunterricht",
  },
  {
    title: "Ponyreiten",
    description: "Geführtes Reiten für Kinder ab 3 Jahren auf unseren lieben, sicheren Schulponys. Ein unvergessliches Erlebnis.",
    imageSrc: "/images/angebote/ponyreiten-1.jpeg",
    imageAlt: "Kind auf Shetland-Pony",
    href: "/angebote/ponyreiten",
  },
  {
    title: "Longenstunden",
    description: "An der Longe lernen Sie die Grundlagen des Reitens in sicherer Umgebung — ideal für absolute Anfänger.",
    imageSrc: "/images/angebote/longenstunde.jpeg",
    imageAlt: "Longenstunde auf dem Reitplatz",
    href: "/angebote/reitunterricht",
  },
  {
    title: "Schnupperstunde",
    description: "Noch unsicher? Lernen Sie unsere Pferde kennen und probieren Sie das Reiten unverbindlich aus.",
    imageSrc: "/images/angebote/schnupperstunde.jpeg",
    imageAlt: "Erste Begegnung mit dem Pferd",
    href: "/kontakt",
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
              Ob Anfänger oder Fortgeschrittener, Kind oder Erwachsener — auf dem Reiterhof Mandy Kolatka finden Sie das passende Angebot.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Grid */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {ANGEBOTE.map((angebot, i) => (
              <ScrollReveal key={angebot.title} delay={i * 100}>
                <Card
                  imageSrc={angebot.imageSrc}
                  imageAlt={angebot.imageAlt}
                  title={angebot.title}
                  description={angebot.description}
                  href={angebot.href}
                >
                  <p className="mt-4 text-forest font-semibold text-sm">Mehr erfahren →</p>
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
            <h2 className="text-3xl sm:text-4xl text-white mb-4">Bereit für Ihre erste Reitstunde?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
              Vereinbaren Sie eine unverbindliche Schnupperstunde und lernen Sie unseren Hof kennen.
            </p>
            <Button href="/kontakt" variant="primary" size="lg">Schnupperstunde vereinbaren</Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
