import Image from "next/image";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";
import WatercolorCanvas from "@/components/effects/WatercolorCanvas";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import InquiryButton from "@/components/ui/InquiryButton";
import SectionDivider from "@/components/ui/SectionDivider";
import {
  getActiveAnnouncements,
  getFeaturedHomeOffers,
  getFeaturedUpcomingEvent,
  getHomePageContent,
  getSiteSettings,
} from "@/lib/content";

function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Home() {
  const siteSettings = getSiteSettings();
  const home = getHomePageContent();
  const featuredOffers = getFeaturedHomeOffers(3);
  const featuredEvent = getFeaturedUpcomingEvent();
  const announcements = getActiveAnnouncements();

  return (
    <>
      <section className="relative h-[170vh]">
        <div className="sticky top-0 h-screen flex items-end overflow-hidden">
          <WatercolorCanvas
            imageSrc={siteSettings.heroImage}
            watercolorSrc={siteSettings.heroWatercolorImage}
            imageAlt={`${siteSettings.businessName} - Panorama mit Reitplatz und Zwenkauer See bei Sonnenuntergang`}
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
                <InquiryButton label={home.heroPrimaryCtaLabel} size="lg" />
                <Button
                  href="/angebote"
                  variant="secondary"
                  size="lg"
                  className="border-white/60 text-white hover:bg-white/15 hover:text-white"
                >
                  {home.heroSecondaryCtaLabel}
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {announcements.length > 0 && (
        <>
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
          <SectionDivider />
        </>
      )}

      <section className="relative bg-white overflow-hidden">
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

      <SectionDivider />

      <section className="bg-beige py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
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
                      {home.eventsEyebrow}
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

      <section className="relative bg-forest text-white py-20 md:py-28 overflow-hidden">
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
                {home.contactEyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] text-white mb-6">
                {home.contactTitle}
              </h2>
              <p className="text-white/80 text-lg mb-10">{home.contactText}</p>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="space-y-4 text-white/85 text-lg mb-10">
                <p className="flex items-center justify-center gap-3">
                  <MapPin className="w-5 h-5 text-gold-light shrink-0" />
                  {siteSettings.address}
                </p>
                <p className="flex items-center justify-center gap-3">
                  <Phone className="w-5 h-5 text-gold-light shrink-0" />
                  {siteSettings.phone}
                </p>
                <p className="flex items-center justify-center gap-3">
                  <Mail className="w-5 h-5 text-gold-light shrink-0" />
                  {siteSettings.email}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <Button href="/kontakt" variant="primary" size="lg">
                {home.contactCtaLabel}
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
