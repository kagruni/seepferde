import Image from "next/image";
import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import { Shield, Heart, Sun, Smile } from "lucide-react";

export const metadata: Metadata = {
  title: "Ponyreiten für Kinder",
  description: "Geführtes Ponyreiten für Kinder ab 3 Jahren auf dem Reiterhof Mandy Kolatka in Zwenkau. Sicher, liebevoll und unvergesslich.",
};

const HIGHLIGHTS = [
  { icon: Heart, title: "Ab 3 Jahren", text: "Schon die Kleinsten können auf unseren ruhigen Ponys erste Reiterfahrungen sammeln." },
  { icon: Shield, title: "Sicherheit", text: "Alle Ponys werden von erfahrenen Betreuern geführt. Ihr Kind ist in sicheren Händen." },
  { icon: Sun, title: "Draußen in der Natur", text: "Ponyreiten im Freien — auf unserer Anlage mit Blick auf den Zwenkauer See." },
  { icon: Smile, title: "Unvergesslich", text: "Ob Geburtstag oder einfach so — Ponyreiten ist ein Erlebnis, das Kinderaugen leuchten lässt." },
];

export default function Ponyreiten() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-end">
        <Image src="/images/angebote/ponyreiten-1.jpeg" alt="Kind auf Shetland-Pony" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A3F28]/70 via-[#2A3F28]/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <ScrollReveal>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white drop-shadow-lg">Ponyreiten</h1>
            <p className="mt-3 text-lg text-cream/90 max-w-lg">Für Kinder ab 3 Jahren — sicher, liebevoll, unvergesslich.</p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Intro */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Für die Kleinsten</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Geführtes Ponyreiten</h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Beim geführten Ponyreiten erleben Kinder ab 3 Jahren ihre erste Begegnung mit Pferden. Unsere sanften Schulponys sind bestens an kleine Reiter gewöhnt und werden von erfahrenen Betreuern geführt.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Eine Begleitperson kann jederzeit neben dem Pony mitlaufen. Helme und Sicherheitswesten stellen wir gerne zur Verfügung.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed">
                  Das Ponyreiten dauert ca. 30 Minuten und umfasst eine kleine Runde über unsere Anlage. Auf Wunsch dürfen die Kinder ihr Pony vorher und nachher streicheln und striegeln.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <Image src="/images/angebote/ponyreiten-2.jpeg" alt="Kind auf Pony auf ländlichem Weg" width={700} height={500} className="rounded-2xl w-full object-cover shadow-sm" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Highlights */}
      <section className="bg-beige py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl">Warum Ponyreiten bei uns?</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HIGHLIGHTS.map((h, i) => (
              <ScrollReveal key={h.title} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 border border-brown/8 text-center">
                  <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <h.icon className="w-6 h-6 text-forest" />
                  </div>
                  <h3 className="text-lg mb-2">{h.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{h.text}</p>
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
            <h2 className="text-3xl sm:text-4xl text-white mb-4">Termin für Ponyreiten vereinbaren</h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">Kontaktieren Sie uns und machen Sie Ihrem Kind eine Freude.</p>
            <Button href="/kontakt" variant="primary" size="lg">Jetzt Termin anfragen</Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
