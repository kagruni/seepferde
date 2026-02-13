import type { Metadata } from "next";
import PriceCard from "@/components/ui/PriceCard";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import Button from "@/components/ui/Button";
import { PRICES } from "@/lib/constants";
import { Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Preise",
  description: "Preisübersicht für Reitunterricht, Ponyreiten und Schnupperstunden auf dem Reiterhof Mandy Kolatka in Zwenkau.",
};

export default function Preise() {
  return (
    <>
      {/* Header */}
      <section className="bg-beige pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Übersicht</p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">Unsere Preise</h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              Transparent und fair — hier finden Sie eine Übersicht unserer aktuellen Preise.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Price Grid */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {PRICES.map((price, i) => (
              <ScrollReveal key={price.title} delay={i * 100}>
                <PriceCard {...price} />
              </ScrollReveal>
            ))}
          </div>

          {/* Disclaimer */}
          <ScrollReveal delay={200}>
            <div className="mt-12 bg-beige rounded-2xl p-6 md:p-8 flex gap-4 items-start">
              <Info className="w-6 h-6 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Hinweis zu den Preisen</p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Alle angegebenen Preise sind Platzhalter und werden in Kürze mit den aktuellen Preisen aktualisiert. Für verbindliche Preisinformationen kontaktieren Sie uns bitte direkt.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl text-white mb-4">Jetzt Schnupperstunde buchen</h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
              Überzeugen Sie sich selbst — Ihre erste Reitstunde wartet auf Sie.
            </p>
            <Button href="/kontakt" variant="primary" size="lg">Schnupperstunde vereinbaren</Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
