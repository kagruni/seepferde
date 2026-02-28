import Image from "next/image";
import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import { Sun, Flame, Camera, UtensilsCrossed } from "lucide-react";

export const metadata: Metadata = {
  title: "Erlebnistag — Raus aus dem Alltag — Reiterhof Mandy Kolatka",
  description: "Kreativer Erlebnistag auf dem Reiterhof — Teamgeist stärken durch gemeinsames Erleben. Für Firmen, Vereine, Familien.",
};

const EXTRAS = [
  { icon: UtensilsCrossed, title: "Catering", text: "Volle Verpflegung auf Wunsch — von herzhaft bis süß, alles organisiert." },
  { icon: Flame, title: "Lagerfeuer", text: "Den Tag gemütlich am Lagerfeuer ausklingen lassen — für unvergessliche Momente." },
  { icon: Camera, title: "Fotograf", text: "Professionelle Fotos, die Ihren Erlebnistag für immer festhalten." },
  { icon: Sun, title: "Volle Organisation", text: "Wir kümmern uns um alles — Sie müssen nur kommen und genießen." },
];

export default function Erlebnistag() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-end">
        <Image src="/images/angebote/erlebnistag.jpeg" alt="Erlebnistag auf dem Reiterhof" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A3F28]/70 via-[#2A3F28]/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <ScrollReveal>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white drop-shadow-lg">Raus aus dem Alltag – rein ins Erleben!</h1>
            <p className="mt-3 text-lg text-cream/90 max-w-lg">Ein kreativer Erlebnistag, der Teamgeist stärkt und Erinnerungen schafft.</p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Description */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Erlebnistag</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Gemeinsam erleben, gemeinsam wachsen</h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Raus aus dem Büro, raus aus dem Alltag — rein in ein Erlebnis, das verbindet. Unser Erlebnistag auf dem Reiterhof bietet Ihnen die Möglichkeit, in der Natur zusammenzukommen und als Gruppe etwas Besonderes zu erleben.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Ob gemeinsame Aktivitäten mit Pferden, kreative Team-Aufgaben oder einfach Zeit in der Natur — wir gestalten den Tag ganz nach Ihren Vorstellungen.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed">
                  Am Ende steht nicht nur ein Tag voller Erlebnisse, sondern ein gestärktes Miteinander, das im Alltag nachwirkt.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <Image src="/images/angebote/erlebnistag.jpeg" alt="Gruppe beim Erlebnistag auf dem Reiterhof" width={700} height={500} className="rounded-2xl w-full object-cover shadow-sm" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Für wen? */}
      <section className="bg-beige py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <Image src="/images/angebote/erlebnistag.jpeg" alt="Verschiedene Gruppen beim Erlebnistag" width={700} height={500} className="rounded-2xl w-full object-cover shadow-sm" />
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Für wen?</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Für alle, die gemeinsam etwas erleben wollen</h2>
                <ul className="space-y-3 text-text-secondary text-lg">
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Firmen und Unternehmen</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Vereine und Verbände</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Familien und Familienfeiern</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Freundeskreise</li>
                </ul>
                <div className="mt-8 bg-white rounded-2xl p-6 border border-brown/8">
                  <p className="text-forest font-semibold mb-2">Besonderheit</p>
                  <p className="text-text-secondary leading-relaxed">
                    Keine Reiterfahrung nötig — der Erlebnistag ist für jeden zugänglich, unabhängig von Alter und Vorerfahrung.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Extras Grid */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Rundum sorglos</p>
              <h2 className="text-3xl sm:text-4xl">Extras für Ihren Erlebnistag</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXTRAS.map((e, i) => (
              <ScrollReveal key={e.title} delay={i * 100}>
                <div className="bg-cream rounded-2xl p-6 border border-brown/8 text-center">
                  <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <e.icon className="w-6 h-6 text-forest" />
                  </div>
                  <h3 className="text-lg mb-2">{e.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{e.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl text-white mb-4">Ihren Erlebnistag planen</h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">Kontaktieren Sie uns — wir gestalten einen unvergesslichen Tag ganz nach Ihren Wünschen.</p>
            <Button href="/kontakt" variant="primary" size="lg">Jetzt anfragen</Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
