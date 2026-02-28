import Image from "next/image";
import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import { Mountain, TreePine, Footprints, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Extreme-Trail Park — Erster in Sachsen — Reiterhof Mandy Kolatka",
  description: "Erster Extreme-Trail Park in Sachsen! Hindernisse aus natürlichen Materialien. Vertrauen aufbauen für Mensch und Pferd.",
};

const HINDERNISSE = [
  { icon: Mountain, title: "Gräben & Felsen", text: "Natürliche Geländeformationen fordern Mut und fördern die Trittsicherheit Ihres Pferdes." },
  { icon: TreePine, title: "Baumstämme & Brücken", text: "Über natürliche Hindernisse hinweg — Ihr Pferd lernt, Ihnen zu vertrauen und eigenständig zu denken." },
  { icon: Footprints, title: "Verschiedene Untergründe", text: "Sand, Holz, Stein — jeder Schritt ist ein neues Erlebnis für Pferd und Reiter." },
  { icon: Shield, title: "Sicherheit & Vertrauen", text: "Professionelle Begleitung bei jedem Hindernis. Sicherheit steht immer an erster Stelle." },
];

export default function ExtremeTrail() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-end">
        <Image src="/images/hero/hero-main.jpeg" alt="Extreme-Trail Park auf dem Reiterhof" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A3F28]/70 via-[#2A3F28]/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <ScrollReveal>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white drop-shadow-lg">Extreme-Trail</h1>
            <p className="mt-3 text-lg text-cream/90 max-w-lg">Erster Extreme-Trail Park in Sachsen! Vertrauen aufbauen für Mensch und Pferd.</p>
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
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Workshop</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Natur pur — Abenteuer für Mensch und Pferd</h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Unser Extreme-Trail Park ist der erste in Sachsen! Auf einem naturnah gestalteten Parcours erwarten Sie und Ihr Pferd Hindernisse aus natürlichen Materialien — Gräben, Brücken, Baumstämme und Felsen.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Hier lernen Pferde, mutig und eigenständig Herausforderungen zu meistern. Gleichzeitig stärken Sie als Reiter das Vertrauen und die Partnerschaft mit Ihrem Pferd.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed">
                  Der Extreme-Trail bietet artgerechte Beschäftigung und ist die ideale Geländevorbereitung — für Pferde aller Rassen und Reitweisen.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <Image src="/images/hero/hero-main.jpeg" alt="Pferd auf dem Extreme-Trail Parcours" width={700} height={500} className="rounded-2xl w-full object-cover shadow-sm" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Hindernisse Grid */}
      <section className="bg-beige py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Der Parcours</p>
              <h2 className="text-3xl sm:text-4xl">Was Sie erwartet</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HINDERNISSE.map((h, i) => (
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

      <SectionDivider />

      {/* Teilnehmer & Info */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ScrollReveal>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Teilnehmer</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Für alle Rassen und Reitweisen</h2>
                <ul className="space-y-3 text-text-secondary text-lg">
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Alle Pferderassen willkommen</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Alle Reitweisen (Dressur, Western, Freizeit etc.)</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Anfänger bis Fortgeschrittene</li>
                </ul>
                <div className="mt-8 bg-cream rounded-2xl p-6 border border-brown/8">
                  <p className="text-forest font-semibold mb-2">Teilnehmerzahl</p>
                  <p className="text-text-secondary leading-relaxed">
                    4–8 aktive Teilnehmer + 10 Zuschauerplätze
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Gut zu wissen</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Eigenes oder Hofpferd</h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Sie können mit Ihrem eigenen Pferd teilnehmen oder eines unserer erfahrenen Hofpferde nutzen. Beide Optionen bieten ein intensives Erlebnis auf dem Extreme-Trail.
                </p>
                <div className="bg-cream rounded-2xl p-6 border border-brown/8">
                  <p className="text-forest font-semibold mb-2">Besonderheit</p>
                  <p className="text-text-secondary leading-relaxed">
                    Teilnahme mit eigenem Pferd oder mit einem Pferd vom Hof möglich — sprechen Sie uns einfach an.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl text-white mb-4">Extreme-Trail erleben</h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">Kontaktieren Sie uns und sichern Sie sich Ihren Platz auf Sachsens erstem Extreme-Trail Park.</p>
            <Button href="/kontakt" variant="primary" size="lg">Jetzt anfragen</Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
