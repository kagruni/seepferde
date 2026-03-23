import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";
import WatercolorCanvas from "@/components/effects/WatercolorCanvas";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionDivider from "@/components/ui/SectionDivider";
import {
  getActiveAnnouncements,
  getFeaturedHomeOffers,
  getFeaturedUpcomingEvent,
  getHomePageContent,
  getSiteSettings,
} from "@/lib/content";

export default function Home() {
  const siteSettings = getSiteSettings();
  const home = getHomePageContent();
  const featuredOffers = getFeaturedHomeOffers(3);
  const featuredEvent = getFeaturedUpcomingEvent();
  const announcements = getActiveAnnouncements();

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[170vh]">
        <div className="sticky top-0 h-screen flex items-end overflow-hidden">
          <WatercolorCanvas
            imageSrc={siteSettings.heroImage}
            watercolorSrc={siteSettings.heroWatercolorImage}
            imageAlt={`${siteSettings.businessName} — Panorama mit Reitplatz und Zwenkauer See bei Sonnenuntergang`}
            priority
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 w-full">
            <ScrollReveal>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight max-w-2xl drop-shadow-lg">
                {home.heroTitle}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <p className="mt-4 text-lg sm:text-xl text-cream/90 max-w-lg font-body drop-shadow-md">
                {home.heroSubtitle}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  href="/angebote"
                  variant="secondary"
                  size="lg"
                  className="border-white/80 text-white hover:bg-white hover:text-text bg-transparent"
                >
                  {home.heroPrimaryCtaLabel}
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Horse Divider */}
      <SectionDivider variant="horse" />

      {/* Announcements */}
      {announcements.length > 0 && (
        <section className="bg-cream py-5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            {announcements.map((announcement) => (
              <div
                key={announcement.slug}
                className="rounded-2xl border border-forest/10 bg-white px-5 py-4 text-center shadow-sm"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold mb-1">
                  {announcement.title}
                </p>
                <p className="text-text-secondary">
                  {announcement.message}{" "}
                  {announcement.linkHref && announcement.linkLabel ? (
                    <Button
                      href={announcement.linkHref}
                      variant="ghost"
                      className="inline-flex p-0 text-forest underline underline-offset-4"
                    >
                      {announcement.linkLabel}
                    </Button>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 1: Welcome — "Ein Ort, an dem Pferdeträume wahr werden" */}
      <section className="relative bg-cream overflow-hidden">
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
                <p className="text-gold font-semibold tracking-[0.2em] uppercase text-sm mb-3">
                  {home.welcomeEyebrow}
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] leading-tight mb-6">
                  {home.welcomeTitle}
                </h2>
                {home.welcomeParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-text-secondary text-lg leading-relaxed mb-4"
                  >
                    {paragraph}
                  </p>
                ))}
                <Button href="/ueber-uns" variant="ghost">
                  Mehr über uns erfahren →
                </Button>
              </div>
            </ScrollReveal>

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

      {/* Ornamental Divider */}
      <SectionDivider variant="ornament" />

      {/* Section 2: Unsere Angebote */}
      <section className="bg-beige py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gold font-semibold tracking-[0.2em] uppercase text-sm mb-3">
                {home.offersEyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem]">
                {home.offersTitle}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {featuredOffers.map((offer, index) => (
              <ScrollReveal key={offer.slug} delay={index * 150} className="h-full">
                <Card
                  imageSrc={offer.imageSrc}
                  imageAlt={offer.imageAlt}
                  title={offer.title}
                  description={offer.summary}
                  href={`/angebote/${offer.slug}`}
                >
                  <p className="mt-4 text-forest font-semibold text-sm hover:text-forest-dark transition-colors">
                    Mehr erfahren →
                  </p>
                </Card>
              </ScrollReveal>
            ))}
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

      {/* Horse Divider */}
      <SectionDivider variant="horse" />

      {/* Section 3: Full-width Event Banner */}
      {featuredEvent && (
        <section className="relative py-32 md:py-44 overflow-hidden">
          <Image
            src={featuredEvent.imageSrc}
            alt={featuredEvent.imageAlt}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#3D2A35]/70" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight mb-6">
                {featuredEvent.title}
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                {featuredEvent.description}
              </p>
              <Button
                href={`/veranstaltungen/${featuredEvent.slug}`}
                variant="primary"
                size="lg"
              >
                Mehr Erfahren
              </Button>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Section 4: Lernen Sie den Hof kennen */}
      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/hero/hero-main.jpeg"
                  alt="Ansicht des Reiterhofs See-Pferde Zwenkau"
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] leading-tight mb-4">
                  {home.contactTitle}
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  {home.contactText}
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-text-secondary">
                    <span className="w-2 h-2 bg-gold rounded-full shrink-0" />
                    Pferdegestütztes Coaching
                  </li>
                  <li className="flex items-center gap-3 text-text-secondary">
                    <span className="w-2 h-2 bg-gold rounded-full shrink-0" />
                    Reiten &amp; Sport
                  </li>
                  <li className="flex items-center gap-3 text-text-secondary">
                    <span className="w-2 h-2 bg-gold rounded-full shrink-0" />
                    Events &amp; Sport
                  </li>
                </ul>

                <Button href="/ueber-uns" variant="primary">
                  {home.contactCtaLabel}
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
