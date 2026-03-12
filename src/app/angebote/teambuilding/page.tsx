import Image from "next/image";
import type { Metadata } from "next";
import InquiryButton from "@/components/ui/InquiryButton";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import { Users, MessageCircle, Zap, Heart, ListChecks, Handshake, GitBranch } from "lucide-react";

export const metadata: Metadata = {
  title: "Pferdegestütztes Teambuilding — Reiterhof Mandy Kolatka",
  description: "Pferdegestütztes Teambuilding in Zwenkau — das Pferd als neues Teammitglied. Teamdynamik erkennen und stärken.",
};

const THEMEN = [
  { icon: MessageCircle, title: "Kommunikation im Team", text: "Wie klar kommunizieren Sie wirklich? Das Pferd zeigt, ob Ihre Botschaft ankommt." },
  { icon: Zap, title: "Motivation", text: "Erfahren Sie, was Ihr Team antreibt — und wie Sie diese Energie gezielt nutzen." },
  { icon: GitBranch, title: "Veränderungsprozesse", text: "Veränderung braucht Vertrauen. Erleben Sie, wie Ihr Team auf Neues reagiert." },
  { icon: Heart, title: "Teamgefühl stärken", text: "Gemeinsame Erlebnisse mit Pferden schaffen eine Verbundenheit, die im Büro nachwirkt." },
  { icon: ListChecks, title: "Aufgabenverteilung", text: "Wer übernimmt welche Rolle? Pferde machen Teamstrukturen sichtbar." },
  { icon: Handshake, title: "Miteinander statt Gegeneinander", text: "Kooperation statt Konkurrenz — das Pferd als gemeinsames Ziel verbindet." },
  { icon: Users, title: "Hierarchien erkennen", text: "Informelle Strukturen werden sichtbar, wenn ein Pferd Teil des Teams wird." },
];

export default function Teambuilding() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-end">
        <Image src="/images/angebote/teambuilding.jpeg" alt="Pferdegestütztes Teambuilding auf dem Reiterhof" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A3F28]/70 via-[#2A3F28]/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <ScrollReveal>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white drop-shadow-lg">Teambuilding</h1>
            <p className="mt-3 text-lg text-cream/90 max-w-lg">Das Pferd als neues Teammitglied — Teamdynamik erkennen und stärken.</p>
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
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Pferdegestütztes Teambuilding</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Ein neues Teammitglied auf vier Hufen</h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Was passiert, wenn Ihr Team eine Aufgabe mit einem Pferd lösen muss? Rollen werden sichtbar, Kommunikationsmuster offengelegt, und echte Stärken treten zutage.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Beim pferdegestützten Teambuilding arbeiten Sie gemeinsam als Team mit dem Pferd. Die Übungen am Boden fordern Zusammenarbeit, klare Kommunikation und gegenseitiges Vertrauen.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed">
                  Die Erfahrungen auf dem Reiterhof lassen sich direkt auf den Arbeitsalltag übertragen — für ein stärkeres Miteinander im Team.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <Image src="/images/angebote/teambuilding.jpeg" alt="Team bei Übungen mit Pferd" width={700} height={500} className="rounded-2xl w-full object-cover shadow-sm" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Themen Grid */}
      <section className="bg-beige py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Themen</p>
              <h2 className="text-3xl sm:text-4xl">Was Ihr Team erlebt</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {THEMEN.map((t, i) => (
              <ScrollReveal key={t.title} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-brown/8">
                  <t.icon className="w-8 h-8 text-forest mb-4" />
                  <h3 className="text-xl mb-2">{t.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{t.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Teilnehmer & Format */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ScrollReveal>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Für wen?</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Teilnehmer</h2>
                <ul className="space-y-3 text-text-secondary text-lg">
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Unternehmerinnen und Unternehmer</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Managerinnen und Manager</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Abteilungs-, Team- und Projektleiter</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Personalverantwortliche</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Mitarbeiterinnen und Mitarbeiter</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Nachwuchskräfte</li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Format</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Einzel- und Gruppencoaching</h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Unser Teambuilding-Angebot ist flexibel gestaltbar — ob als halbtägiges Team-Event oder als intensiver Ganztages-Workshop. Auch Buchungen für Unternehmen sind möglich.
                </p>
                <div className="bg-cream rounded-2xl p-6 border border-brown/8">
                  <p className="text-forest font-semibold mb-2">Besonderheit</p>
                  <p className="text-text-secondary leading-relaxed">
                    Keine Reiterfahrung nötig — die Arbeit findet am Boden statt, nicht im Sattel. Das Teambuilding ist für jeden zugänglich.
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
            <h2 className="text-3xl sm:text-4xl text-white mb-4">Stärken Sie Ihr Team</h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">Kontaktieren Sie uns für ein individuelles Teambuilding-Angebot — wir gestalten den Tag nach Ihren Wünschen.</p>
            <InquiryButton subject="Teambuilding" label="Angebot anfragen" size="lg" />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
