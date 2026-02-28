import Image from "next/image";
import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import { Crown, Compass, Shield, ArrowUpRight, Eye, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Pferdegestütztes Führungskräfte-Coaching — Reiterhof Mandy Kolatka",
  description: "Pferdegestütztes Leadership-Coaching in Zwenkau — Pferde als Spiegel für Ihr Führungsverhalten. Einzel- und Gruppencoaching für Führungskräfte.",
};

const THEMEN = [
  { icon: Crown, title: "Führungsstile erkennen", text: "Entdecken Sie Ihren natürlichen Führungsstil und lernen Sie, ihn situativ einzusetzen." },
  { icon: Shield, title: "Authentizität stärken", text: "Pferde reagieren auf echte Präsenz — lernen Sie, authentisch und überzeugend aufzutreten." },
  { icon: ArrowUpRight, title: "Durchsetzungsfähigkeit", text: "Klare Führung ohne Druck — das Pferd zeigt Ihnen, wann Sie wirklich führen." },
  { icon: Compass, title: "Veränderungsprozesse begleiten", text: "Veränderung beginnt bei Ihnen selbst. Pferde machen Widerstände und Chancen sichtbar." },
  { icon: Eye, title: "Eigene Rolle einordnen", text: "Wo stehen Sie im Team? Das Pferd spiegelt Ihre Position ehrlich und unmittelbar." },
  { icon: BarChart3, title: "Stärken & Schwächen erkennen", text: "Erhalten Sie ein unverfälschtes Feedback zu Ihrem Führungsverhalten — direkt vom Pferd." },
];

export default function FuehrungskraefteCoaching() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-end">
        <Image src="/images/hero/hero-main.jpeg" alt="Pferdegestütztes Führungskräfte-Coaching auf dem Reiterhof" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A3F28]/70 via-[#2A3F28]/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <ScrollReveal>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white drop-shadow-lg">Coaching für Führungskräfte</h1>
            <p className="mt-3 text-lg text-cream/90 max-w-lg">Pferde als Spiegel für Ihr Führungsverhalten — ehrlich, direkt, unvergesslich.</p>
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
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Pferdegestütztes Coaching</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Das Pferd als ehrlichster Spiegel</h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Pferde reagieren unmittelbar auf Ihre Körpersprache, Ihre Emotionen und Ihre innere Haltung. Sie bewerten nicht — sie spiegeln. Genau das macht sie zu idealen Coaching-Partnern für Führungskräfte.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  In unserem pferdegestützten Leadership-Coaching arbeiten Sie nicht auf dem Pferd, sondern mit dem Pferd. Durch gezielte Übungen am Boden erleben Sie in Echtzeit, wie Ihre Führung wirkt — und wo Potenzial liegt.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed">
                  Das Ergebnis: Nachhaltige Erkenntnisse über Ihren Führungsstil, die weit über den Reiterhof hinaus wirken.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <Image src="/images/hero/hero-main.jpeg" alt="Führungskraft beim Coaching mit Pferd" width={700} height={500} className="rounded-2xl w-full object-cover shadow-sm" />
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
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Coaching-Themen</p>
              <h2 className="text-3xl sm:text-4xl">Was Sie erwartet</h2>
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
                  <li className="flex items-start gap-3"><span className="w-2 h-2 bg-forest rounded-full mt-2.5 shrink-0" />Nachwuchskräfte mit Führungsaufgaben</li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Format</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Einzel- und Gruppencoaching</h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Wir bieten sowohl Einzelcoachings als auch Gruppensessions an — individuell abgestimmt auf Ihre Bedürfnisse und Ziele. Auch Buchungen für ganze Unternehmen sind möglich.
                </p>
                <div className="bg-cream rounded-2xl p-6 border border-brown/8">
                  <p className="text-forest font-semibold mb-2">Besonderheit</p>
                  <p className="text-text-secondary leading-relaxed">
                    Keine Reiterfahrung nötig — die Arbeit findet am Boden statt, nicht im Sattel. Das Coaching ist für jeden zugänglich, unabhängig von Vorerfahrung mit Pferden.
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
            <h2 className="text-3xl sm:text-4xl text-white mb-4">Bereit für neue Perspektiven?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">Kontaktieren Sie uns für ein individuelles Coaching-Angebot — wir beraten Sie gerne.</p>
            <Button href="/kontakt" variant="primary" size="lg">Angebot anfragen</Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
