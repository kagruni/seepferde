import Image from "next/image";
import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import { Target, CircleDot, Route, Flag } from "lucide-react";

export const metadata: Metadata = {
  title: "Working-Equitation Workshop — Reiterhof Mandy Kolatka",
  description: "Working-Equitation Workshop in Zwenkau — Motivations-Parcours für Pferd und Reiter mit dressurmäßiger Arbeit und Trail-Aufgaben.",
};

const PARCOURS = [
  { title: "Stier zum Ringstechen", text: "Präzision und Geschicklichkeit beim klassischen Ringstechen am Stier." },
  { title: "Parallelslalom", text: "Geschmeidige Richtungswechsel zwischen den Stangen — Koordination pur." },
  { title: "Brücke", text: "Vertrauen und Gelassenheit beim Überqueren der Brücke." },
  { title: "Tonnen", text: "Wendungen um die Tonnen — Geschicklichkeit und Harmonie zwischen Reiter und Pferd." },
  { title: "Glockengasse", text: "Ruhig und konzentriert durch die enge Gasse navigieren." },
  { title: "Pferch", text: "Öffnen und Schließen des Pferchs — eine klassische Arbeitsaufgabe." },
  { title: "Tor", text: "Das Tor einhändig öffnen, durchreiten und schließen — Koordination und Feinmotorik." },
  { title: "Sprung", text: "Ein kleiner Sprung als Abschluss — Mut und Vertrauen für Pferd und Reiter." },
];

export default function WorkingEquitation() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-end">
        <Image src="/images/angebote/working-equitation.jpeg" alt="Working-Equitation auf dem Reiterhof" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A3F28]/70 via-[#2A3F28]/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <ScrollReveal>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white drop-shadow-lg">Working-Equitation</h1>
            <p className="mt-3 text-lg text-cream/90 max-w-lg">Motivations-Parcours für Pferd und Reiter — Dressur trifft Trail.</p>
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
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Dressur mit Sinn und Spaß</h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Working-Equitation verbindet dressurmäßige Arbeit mit konkreten Trail-Aufgaben. Das Ergebnis: Ein Motivations-Parcours, der Pferd und Reiter gleichermaßen fordert und begeistert.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Statt trockener Dressurarbeit erleben Sie, wie die einzelnen Lektionen plötzlich einen Zweck bekommen — das Tor muss geöffnet, der Pferch geschlossen, die Glocken passiert werden.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed">
                  Working-Equitation ist für alle Rassen und Reitweisen geeignet und bringt neue Motivation in das Training — für Einsteiger wie für Fortgeschrittene.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <Image src="/images/angebote/working-equitation.jpeg" alt="Reiter beim Working-Equitation Parcours" width={700} height={500} className="rounded-2xl w-full object-cover shadow-sm" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Parcours-Elemente */}
      <section className="bg-beige py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Der Parcours</p>
              <h2 className="text-3xl sm:text-4xl">Parcours-Elemente</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PARCOURS.map((p, i) => {
              const icons = [Target, CircleDot, Route, Flag, Target, CircleDot, Route, Flag];
              const Icon = icons[i];
              return (
                <ScrollReveal key={p.title} delay={i * 80}>
                  <div className="bg-white rounded-2xl p-6 border border-brown/8">
                    <Icon className="w-7 h-7 text-forest mb-3" />
                    <h3 className="text-lg mb-2">{p.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{p.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Teilnehmer */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ScrollReveal>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Teilnehmer</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Für Einsteiger bis Fortgeschrittene</h2>
                <ul className="space-y-3 text-text-secondary text-lg">
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Einsteiger mit Grundkenntnissen im Reiten</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Fortgeschrittene Reiter aller Reitweisen</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Pferde aller Rassen</li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Details</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Teilnehmerzahl & Format</h2>
                <div className="space-y-4">
                  <div className="bg-cream rounded-2xl p-6 border border-brown/8">
                    <p className="text-forest font-semibold mb-2">Teilnehmerzahl</p>
                    <p className="text-text-secondary leading-relaxed">
                      4–6 aktive Teilnehmer + 10 Zuschauerplätze
                    </p>
                  </div>
                  <div className="bg-cream rounded-2xl p-6 border border-brown/8">
                    <p className="text-forest font-semibold mb-2">Format</p>
                    <p className="text-text-secondary leading-relaxed">
                      Ganztägiger Workshop mit Theorie und Praxis am Parcours. Individuelle Betreuung in kleiner Gruppe.
                    </p>
                  </div>
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
            <h2 className="text-3xl sm:text-4xl text-white mb-4">Working-Equitation ausprobieren</h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">Kontaktieren Sie uns und sichern Sie sich Ihren Platz im nächsten Workshop.</p>
            <Button href="/kontakt" variant="primary" size="lg">Jetzt anfragen</Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
