import Image from "next/image";
import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import { Users, User, Award, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Reitunterricht für Anfänger & Fortgeschrittene",
  description: "Reitunterricht auf dem Reiterhof Mandy Kolatka — Einzelunterricht, Gruppenunterricht und Longenstunden für alle Leistungsstufen in Zwenkau.",
};

const FEATURES = [
  { icon: Heart, title: "Anfänger", text: "Grundlagen des Reitens, Umgang mit dem Pferd, Schritt und Trab — behutsam und in Ihrem Tempo." },
  { icon: Award, title: "Fortgeschrittene", text: "Vertiefung Ihrer Reitkenntnisse in Dressur und Geländereiten. Feines Reiten mit motivierten Schulpferden." },
  { icon: User, title: "Einzelunterricht", text: "Intensive, individuelle Betreuung — perfekt abgestimmt auf Ihre persönlichen Ziele und Ihr Können." },
  { icon: Users, title: "Gruppenunterricht", text: "In kleinen Gruppen (max. 4 Teilnehmer) macht das Reiten gemeinsam noch mehr Freude." },
];

export default function Reitunterricht() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-end">
        <Image src="/images/angebote/reitunterricht-anfaenger.jpeg" alt="Anfängerin im Reitunterricht" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A3F28]/70 via-[#2A3F28]/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <ScrollReveal>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white drop-shadow-lg">Reitunterricht</h1>
            <p className="mt-3 text-lg text-cream/90 max-w-lg">Für Anfänger und Fortgeschrittene — individuell, einfühlsam, professionell.</p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Features Grid */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Unser Unterricht</p>
              <h2 className="text-3xl sm:text-4xl">Für jedes Level das Richtige</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {FEATURES.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 100}>
                <div className="bg-cream rounded-2xl p-6 md:p-8 border border-brown/8">
                  <f.icon className="w-8 h-8 text-forest mb-4" />
                  <h3 className="text-xl mb-2">{f.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{f.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Longe Section */}
      <section className="bg-beige py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <Image src="/images/angebote/longenstunde.jpeg" alt="Longenstunde — Reiterin auf Schimmel" width={700} height={500} className="rounded-2xl w-full object-cover shadow-sm" />
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Für absolute Anfänger</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Longenstunden</h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  An der Longe können Sie sich ganz auf Ihren Sitz und Ihr Gleichgewicht konzentrieren, während unsere Reitlehrerin das Pferd führt. So entwickeln Sie ein sicheres Gefühl — ohne Druck, in Ihrem eigenen Tempo.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed mb-8">
                  Longenstunden sind der ideale Einstieg ins Reiten und eignen sich besonders für Kinder und Erwachsene, die noch keine Reiterfahrung haben.
                </p>
                <Button href="/kontakt" variant="primary">Schnupperstunde vereinbaren</Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
