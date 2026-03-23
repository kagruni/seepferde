import Image from "next/image";
import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";

export const metadata: Metadata = {
  title: "Über uns",
  description: "Lernen Sie See-Pferde Zwenkau kennen — unsere Philosophie, unser Team und unsere Leidenschaft für Pferde und Reitunterricht.",
};

export default function UeberUns() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-end">
        <Image
          src="/images/hero/hero-rider.jpeg"
          alt="Reiterin auf Fuchs im Schritt am Reitplatz"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D2A35]/70 via-[#3D2A35]/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <ScrollReveal>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white drop-shadow-lg">
              Über uns
            </h1>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Philosophy */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url(/images/textures/paper-warm.jpeg)", backgroundSize: "cover" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Unsere Philosophie</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">Mit Herz und Verstand — für Mensch und Pferd</h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Bei See-Pferde Zwenkau steht das Wohl der Pferde und die Freude am Reiten im Mittelpunkt. Wir glauben, dass ein behutsamer, respektvoller Umgang mit den Tieren die Grundlage für jedes erfolgreiche Reiterlebnis ist.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Unser Unterricht ist individuell auf die Bedürfnisse jedes Reiters abgestimmt — ob jung oder alt, Anfänger oder Fortgeschrittener. In kleinen Gruppen oder im Einzelunterricht nehmen wir uns die Zeit, die Sie brauchen.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed">
                  Unser moderner Standort am Zwenkauer See bietet eine einzigartige Kulisse: zeitgenössische Architektur, grüne Koppeln und der Blick über den See schaffen eine Atmosphäre, in der man den Alltag hinter sich lassen kann.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="relative flex justify-center">
                <Image src="/images/decorative/watercolor-horse.jpeg" alt="Aquarell-Illustration eines Pferdes" width={450} height={450} className="w-full max-w-sm opacity-75" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-beige py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Unser Team</p>
              <h2 className="text-3xl sm:text-4xl">Die Menschen hinter dem Hof</h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-brown/12 p-8 md:p-10 text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden relative">
                <Image
                  src="/images/team/mandy-portrait.jpeg"
                  alt="Mandy Kolatka mit ihren Pferden"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <h3 className="text-2xl mb-1">Mandy Kolatka</h3>
              <p className="text-gold font-semibold text-sm tracking-wide uppercase mb-4">Inhaberin & Reitlehrerin</p>
              <p className="text-text-secondary leading-relaxed">
                [Hier folgt ein persönlicher Text über Mandy Kolatka — ihre Erfahrung, ihre Leidenschaft für Pferde und ihre Vision für den Reiterhof. Dieser Platzhalter wird mit echten Informationen ersetzt.]
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="text-center mt-12">
              <Button href="/kontakt" variant="primary">Lernen Sie uns kennen</Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
