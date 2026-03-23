import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import { Calendar, MapPin } from "lucide-react";
import {
  getFeaturedUpcomingEvent,
  getPastEvents,
  getUpcomingEvents,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Veranstaltungen — See-Pferde Zwenkau",
  description:
    "Aktuelle und vergangene Veranstaltungen bei See-Pferde Zwenkau — Workshops, Kurse und Seminare rund um Pferde in Zwenkau.",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Veranstaltungen() {
  const upcomingEvents = getUpcomingEvents();
  const featuredEvent = getFeaturedUpcomingEvent();
  const pastEvents = getPastEvents();

  return (
    <>
      {/* Header */}
      <section className="bg-beige pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
              Termine & Events
            </p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              Veranstaltungen
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              Workshops, Kurse und Seminare bei See-Pferde Zwenkau — entdecken Sie
              unsere aktuellen Termine und lassen Sie sich von vergangenen
              Veranstaltungen inspirieren.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Featured / Upcoming Event */}
      {featuredEvent && (
        <>
          <section className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <div className="mb-10">
                  <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                    Nächster Termin
                  </p>
                  <h2 className="text-3xl sm:text-4xl">
                    Kommende Veranstaltung
                  </h2>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <Link
                  href={`/veranstaltungen/${featuredEvent.slug}`}
                  className="group block"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-cream rounded-2xl overflow-hidden border border-brown/8 hover:shadow-md transition-shadow">
                    <div className="relative aspect-[16/10] lg:aspect-auto">
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
                    <div className="p-6 md:p-10 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-4 text-text-secondary text-sm mb-4">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-forest" />
                          {formatDate(featuredEvent.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-forest" />
                          {featuredEvent.location}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-heading font-bold mb-4 group-hover:text-forest transition-colors">
                        {featuredEvent.title}
                      </h3>
                      <p className="text-text-secondary text-lg leading-relaxed mb-6">
                        {featuredEvent.description}
                      </p>
                      <p className="text-forest font-semibold group-hover:text-forest-dark transition-colors">
                        Mehr erfahren →
                      </p>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>

              {/* Other upcoming events (non-featured) */}
              {upcomingEvents.filter((e) => !e.featured).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                  {upcomingEvents
                    .filter((e) => !e.featured)
                    .map((event, i) => (
                      <ScrollReveal key={event.slug} delay={i * 100}>
                        <Link
                          href={`/veranstaltungen/${event.slug}`}
                          className="group block bg-cream rounded-2xl overflow-hidden border border-brown/8 hover:shadow-md transition-shadow h-full"
                        >
                          <div className="relative aspect-[16/10]">
                            <Image
                              src={event.imageSrc}
                              alt={event.imageAlt}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-5">
                            <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-2">
                              <Calendar className="w-4 h-4 text-forest" />
                              {formatDate(event.date)}
                            </div>
                            <h3 className="text-lg font-heading font-bold mb-2 group-hover:text-forest transition-colors">
                              {event.title}
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed">
                              {event.description}
                            </p>
                          </div>
                        </Link>
                      </ScrollReveal>
                    ))}
                </div>
              )}
            </div>
          </section>

        </>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <>
          <section className="bg-beige py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <div className="mb-10">
                  <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                    Rückblick
                  </p>
                  <h2 className="text-3xl sm:text-4xl">
                    Vergangene Veranstaltungen
                  </h2>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event, i) => (
                  <ScrollReveal key={event.slug} delay={i * 100}>
                    <Link
                      href={`/veranstaltungen/${event.slug}`}
                      className="group block bg-white rounded-2xl overflow-hidden border border-brown/8 hover:shadow-md transition-shadow h-full"
                    >
                      <div className="relative aspect-[16/10]">
                        <Image
                          src={event.imageSrc}
                          alt={event.imageAlt}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-brown/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
                          {event.kategorie}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-2">
                          <Calendar className="w-4 h-4 text-brown" />
                          {formatDate(event.date)}
                        </div>
                        <h3 className="text-lg font-heading font-bold mb-2 group-hover:text-forest transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

        </>
      )}

      {/* CTA */}
      <section className="bg-[#3D2A35] text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl text-white mb-4">
              Interesse an einer Veranstaltung?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
              Kontaktieren Sie uns für Anmeldung oder Fragen — wir beraten Sie
              gerne zu unseren aktuellen Terminen.
            </p>
            <Button href="/kontakt" variant="primary" size="lg">
              Kontakt aufnehmen
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
