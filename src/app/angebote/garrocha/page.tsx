import Image from "next/image";
import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import { Swords, Focus, Move, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Garrocha Workshop — Reiterhof Mandy Kolatka",
  description: "Garrocha Workshop — Einstieg in die traditionelle südeuropäische Reitkunst. Verbessert Sitz, Linienführung und Fokus.",
};

const VORTEILE = [
  { icon: Focus, title: "Fokus schulen", text: "Die Garrocha erfordert volle Konzentration — und schult so Ihren mentalen Fokus im Sattel." },
  { icon: Swords, title: "Sitz verbessern", text: "Durch das Arbeiten mit der langen Stange entwickeln Sie einen tieferen, stabileren Sitz." },
  { icon: Move, title: "Beweglicher im Sattel", text: "Die Übungen machen Sie geschmeidiger und fördern eine unabhängige Hilfengebung." },
  { icon: Sparkles, title: "Motivation & Freude", text: "Die Garrocha gibt jeder Lektion einen Sinn — und bringt Spaß in das Training." },
];

const VORAUSSETZUNGEN = [
  "Sicheres Reiten im Schritt und Trab",
  "Enge Volten (~6 m Durchmesser) reiten können",
  "Vorhand und Hinterhand verschieben können",
  "Grundlagen des einhändigen Reitens beherrschen",
];

export default function Garrocha() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-end">
        <Image src="/images/hero/hero-main.jpeg" alt="Garrocha-Reiten auf dem Reiterhof" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A3F28]/70 via-[#2A3F28]/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <ScrollReveal>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white drop-shadow-lg">Garrocha</h1>
            <p className="mt-3 text-lg text-cream/90 max-w-lg">Traditionelle südeuropäische Reitkunst — Motivation, Präzision, Freude.</p>
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
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Die Kunst der Garrocha</h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Die Garrocha ist eine lange Stange, die in der traditionellen südeuropäischen Reitkunst verwendet wird. Ursprünglich ein Werkzeug der Hirten, ist sie heute ein faszinierendes Trainingsmittel, das Lektionen einen neuen Sinn gibt.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  In unserem Workshop lernen Sie den Einstieg in das Reiten mit der Garrocha. Die Übungen verbessern Ihren Sitz, Ihre Linienführung und Ihren Fokus — und machen Sie gleichzeitig beweglicher im Sattel.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed">
                  Erfahren Sie, wie ein einfaches Werkzeug das Training von Pferd und Reiter bereichern und motivieren kann.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <Image src="/images/hero/hero-main.jpeg" alt="Reiter mit Garrocha" width={700} height={500} className="rounded-2xl w-full object-cover shadow-sm" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Vorteile Grid */}
      <section className="bg-beige py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Vorteile</p>
              <h2 className="text-3xl sm:text-4xl">Was die Garrocha Ihnen bringt</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VORTEILE.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 border border-brown/8 text-center">
                  <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <v.icon className="w-6 h-6 text-forest" />
                  </div>
                  <h3 className="text-lg mb-2">{v.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{v.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Voraussetzungen */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-10">
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Voraussetzungen</p>
                <h2 className="text-3xl sm:text-4xl">Was Sie mitbringen sollten</h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="bg-cream rounded-2xl p-8 border border-brown/8">
                <ul className="space-y-4 text-text-secondary text-lg">
                  {VORAUSSETZUNGEN.map((v) => (
                    <li key={v} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl text-white mb-4">Garrocha erleben</h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">Kontaktieren Sie uns und melden Sie sich für den nächsten Garrocha-Workshop an.</p>
            <Button href="/kontakt" variant="primary" size="lg">Jetzt anfragen</Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
