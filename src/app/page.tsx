import Image from "next/image";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import { MapPin, Phone, Mail } from "lucide-react";
import { CONTACT } from "@/lib/constants";

export default function Home() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative h-[80vh] min-h-[500px] lg:min-h-[600px] flex items-end">
        <Image
          src="/images/hero/hero-main.jpeg"
          alt="Reiterhof Mandy Kolatka — Panorama mit Reitplatz und Zwenkauer See bei Sonnenuntergang"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A3F28]/80 via-[#2A3F28]/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A3F28]/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 w-full">
          <ScrollReveal>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight max-w-2xl drop-shadow-lg">
              Willkommen auf dem Reiterhof Mandy Kolatka
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="mt-4 text-lg sm:text-xl text-cream/90 max-w-lg font-body drop-shadow-md">
              Reitunterricht & Ponyreiten am Zwenkauer See — familiär,
              naturverbunden, für jedes Alter.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/kontakt" variant="primary" size="lg">
                Schnupperstunde vereinbaren
              </Button>
              <Button href="/angebote" variant="secondary" size="lg" className="border-white/60 text-white hover:bg-white hover:text-text">
                Unsere Angebote
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* ─── WILLKOMMEN ─── */}
      <section className="relative bg-white overflow-hidden">
        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: "url(/images/textures/paper-warm.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                  Herzlich willkommen
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] leading-tight mb-6">
                  Ein Ort, an dem Pferdeträume wahr werden
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Auf unserem familiären Reiterhof in Zwenkau, direkt am
                  wunderschönen Zwenkauer See, bieten wir Reitunterricht und
                  Ponyreiten in einer warmen, einladenden Atmosphäre.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Ob Sie Anfänger sind oder Ihre Reitkenntnisse vertiefen
                  möchten — bei uns finden Sie den passenden Unterricht.
                  Unsere erfahrenen Schulpferde und die persönliche Betreuung
                  sorgen dafür, dass Sie sich vom ersten Moment an wohlfühlen.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed mb-8">
                  Für die Kleinsten ab 3 Jahren bieten wir geführtes
                  Ponyreiten — ein unvergessliches Erlebnis für die ganze
                  Familie.
                </p>
                <Button href="/ueber-uns" variant="ghost">
                  Mehr über uns erfahren →
                </Button>
              </div>
            </ScrollReveal>

            {/* Watercolor horse decorative element */}
            <ScrollReveal delay={200}>
              <div className="relative flex justify-center">
                <Image
                  src="/images/decorative/watercolor-horse.jpeg"
                  alt="Aquarell-Illustration eines Pferdes im Trab"
                  width={500}
                  height={500}
                  className="w-full max-w-md opacity-80 drop-shadow-sm"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── ANGEBOTE ─── */}
      <section className="bg-beige py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                Was wir bieten
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem]">
                Unsere Angebote
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <ScrollReveal delay={0}>
              <Card
                imageSrc="/images/angebote/reitunterricht-anfaenger.jpeg"
                imageAlt="Anfängerin im Reitunterricht auf dem Reitplatz"
                title="Reitunterricht"
                description="Von der ersten Longenstunde bis zum selbstständigen Reiten — für Anfänger und Fortgeschrittene."
                href="/angebote/reitunterricht"
              >
                <p className="mt-4 text-forest font-semibold text-sm hover:text-forest-dark transition-colors">
                  Mehr erfahren →
                </p>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <Card
                imageSrc="/images/angebote/ponyreiten-1.jpeg"
                imageAlt="Kind auf Shetland-Pony, geführt von Betreuerin"
                title="Ponyreiten"
                description="Für Kinder ab 3 Jahren — geführtes Reiten auf unseren lieben Schulponys in sicherer Umgebung."
                href="/angebote/ponyreiten"
              >
                <p className="mt-4 text-forest font-semibold text-sm hover:text-forest-dark transition-colors">
                  Mehr erfahren →
                </p>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <Card
                imageSrc="/images/angebote/schnupperstunde.jpeg"
                imageAlt="Junge Frau streichelt ein Pferd am Stall — erste Begegnung"
                title="Schnupperstunde"
                description="Noch unsicher? Lernen Sie unsere Pferde kennen und probieren Sie das Reiten in einer unverbindlichen Probestunde."
                href="/kontakt"
              >
                <p className="mt-4 text-forest font-semibold text-sm hover:text-forest-dark transition-colors">
                  Jetzt anfragen →
                </p>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={200}>
            <div className="text-center mt-12">
              <Button href="/angebote" variant="secondary">
                Alle Angebote ansehen
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* ─── KONTAKT-TEASER ─── */}
      <section className="relative bg-forest text-white py-20 md:py-28 overflow-hidden">
        {/* Decorative horseshoe */}
        <div className="absolute -right-16 -bottom-16 opacity-[0.08] pointer-events-none">
          <Image
            src="/images/decorative/watercolor-hufeisen.jpeg"
            alt=""
            width={400}
            height={400}
            className="w-80 h-80 object-cover object-top"
            aria-hidden="true"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <ScrollReveal>
              <p className="text-gold-light font-semibold tracking-widest uppercase text-sm mb-3">
                Wir freuen uns auf Sie
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] text-white mb-6">
                Besuchen Sie uns
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="space-y-4 text-white/85 text-lg mb-10">
                <p className="flex items-center justify-center gap-3">
                  <MapPin className="w-5 h-5 text-gold-light shrink-0" />
                  {CONTACT.address}
                </p>
                <p className="flex items-center justify-center gap-3">
                  <Phone className="w-5 h-5 text-gold-light shrink-0" />
                  {CONTACT.phone}
                </p>
                <p className="flex items-center justify-center gap-3">
                  <Mail className="w-5 h-5 text-gold-light shrink-0" />
                  {CONTACT.email}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <Button href="/kontakt" variant="primary" size="lg">
                Kontakt aufnehmen
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
