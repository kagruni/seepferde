import type { Metadata } from "next";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import HorseProfile from "@/components/common/HorseProfile";
import Button from "@/components/ui/Button";
import { getHorses } from "@/lib/content";

export const metadata: Metadata = {
  title: "Unsere Pferde",
  description: "Lernen Sie die Pferde und Ponys des Reiterhof Mandy Kolatka kennen — treue Begleiter im Unterricht und auf dem Hof.",
};

export default function Pferde() {
  const horses = getHorses();

  return (
    <>
      {/* Header */}
      <section className="bg-beige pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Unsere Vierbeiner</p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">Unsere Pferde</h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              Jedes Pferd auf unserem Hof hat seinen eigenen Charakter und seine besonderen Stärken. Lernen Sie unsere treuen Partner kennen.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Horse Grid */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {horses.map((horse, i) => (
              <ScrollReveal key={horse.name} delay={i * 150}>
                <HorseProfile horse={horse} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={200}>
            <div className="mt-16 bg-cream rounded-2xl p-8 md:p-10 border border-brown/8 text-center">
              <h3 className="text-2xl mb-3">Weitere Pferde folgen</h3>
              <p className="text-text-secondary max-w-lg mx-auto mb-6">
                Unser Stall wächst — weitere Pferde und Ponys werden bald vorgestellt. Besuchen Sie uns auf dem Hof und lernen Sie alle persönlich kennen!
              </p>
              <Button href="/kontakt" variant="primary">Hof besuchen</Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
