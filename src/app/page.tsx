import Image from "next/image";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import { MapPin, Phone, Mail, Calendar } from "lucide-react";
import { CONTACT, EVENTS } from "@/lib/constants";

const featuredEvent = EVENTS.find(
  (e) => e.featured && e.status === "upcoming"
);

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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
              Pferdegestütztes Coaching, Workshops & Erlebnisse am Zwenkauer See — individuell, naturverbunden, unvergesslich.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/kontakt" variant="primary" size="lg">
                Angebot anfragen
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
                  Auf unserem Reiterhof in Zwenkau, direkt am wunderschönen
                  Zwenkauer See, verbinden wir die Kraft der Pferde mit
                  Coaching, Workshops und unvergesslichen Erlebnistagen.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  Unser pferdegestütztes Führungskräfte-Coaching und
                  Teambuilding bietet Unternehmen eine einzigartige
                  Möglichkeit, Führungsqualitäten zu entwickeln und
                  Teamdynamiken nachhaltig zu stärken.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed mb-8">
                  In unseren Workshops — vom ersten Extreme-Trail Park
                  Sachsens bis hin zu Working-Equitation und Garrocha —
                  erleben Reiter und Pferdebegeisterte Motivation und Freude.
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
            <ScrollReveal delay={0} className="h-full">
              <Card
                imageSrc="/images/hero/hero-main.jpeg"
                imageAlt="Pferdegestütztes Führungskräfte-Coaching"
                title="Führungskräfte-Coaching"
                description="Pferdegestütztes Leadership-Coaching — Pferde als Spiegel für Führungsverhalten."
                href="/angebote/fuehrungskraefte-coaching"
              >
                <p className="mt-4 text-forest font-semibold text-sm hover:text-forest-dark transition-colors">
                  Mehr erfahren →
                </p>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={150} className="h-full">
              <Card
                imageSrc="/images/hero/hero-main.jpeg"
                imageAlt="Extreme-Trail Park mit natürlichen Hindernissen"
                title="Extreme-Trail"
                description="Erster Extreme-Trail Park in Sachsen! Vertrauen aufbauen für Mensch und Pferd."
                href="/angebote/extreme-trail"
              >
                <p className="mt-4 text-forest font-semibold text-sm hover:text-forest-dark transition-colors">
                  Mehr erfahren →
                </p>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={300} className="h-full">
              <Card
                imageSrc="/images/hero/hero-main.jpeg"
                imageAlt="Erlebnistag auf dem Reiterhof"
                title="Erlebnistag"
                description="Kreativer Erlebnistag — Teamgeist stärken durch gemeinsames Erleben mit Pferden."
                href="/angebote/erlebnistag"
              >
                <p className="mt-4 text-forest font-semibold text-sm hover:text-forest-dark transition-colors">
                  Mehr erfahren →
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

      {/* ─── VERANSTALTUNG ─── */}
      {featuredEvent && (
        <>
          <SectionDivider />

          <section className="bg-white py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <ScrollReveal>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <Image
                      src={featuredEvent.imageSrc}
                      alt={featuredEvent.imageAlt}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-forest text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
                      {featuredEvent.kategorie}
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={150}>
                  <div>
                    <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                      Nächste Veranstaltung
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] leading-tight mb-4">
                      {featuredEvent.title}
                    </h2>
                    <p className="flex items-center gap-2 text-forest font-medium mb-4">
                      <Calendar className="w-5 h-5" />
                      {formatDate(featuredEvent.date)}
                    </p>
                    <p className="text-text-secondary text-lg leading-relaxed mb-8">
                      {featuredEvent.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button
                        href={`/veranstaltungen/${featuredEvent.slug}`}
                        variant="primary"
                      >
                        Mehr erfahren
                      </Button>
                      <Button href="/veranstaltungen" variant="ghost">
                        Alle Veranstaltungen →
                      </Button>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        </>
      )}

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
