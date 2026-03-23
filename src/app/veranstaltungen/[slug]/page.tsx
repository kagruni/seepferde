import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import MarkdownContent from "@/components/common/MarkdownContent";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import { Calendar, MapPin, Tag, ArrowLeft, CheckCircle2 } from "lucide-react";
import { getEventBySlug, getEvents } from "@/lib/content";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function generateStaticParams() {
  return getEvents().map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Veranstaltung nicht gefunden" };
  return {
    title: `${event.title} — See-Pferde Zwenkau`,
    description: event.description,
  };
}

export default async function EventDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const isPast = event.status === "past";

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-end">
        <Image
          src={event.imageSrc}
          alt={event.imageAlt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D2A35]/70 via-[#3D2A35]/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <ScrollReveal>
            <Link
              href="/veranstaltungen"
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Alle Veranstaltungen
            </Link>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white drop-shadow-lg">
              {event.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-cream/90">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(event.date)}
                {event.endDate && event.endDate !== event.date && (
                  <> – {formatDate(event.endDate)}</>
                )}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {event.location}
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Description + Details */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                  {isPast ? "Rückblick" : "Über die Veranstaltung"}
                </p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">
                  {isPast ? "So war es" : "Das erwartet Sie"}
                </h2>
                <MarkdownContent className="text-text-secondary text-lg leading-relaxed">
                  {event.body}
                </MarkdownContent>
              </ScrollReveal>
            </div>

            {/* Sidebar */}
            <div>
              <ScrollReveal delay={150}>
                <div className="bg-cream rounded-2xl p-6 border border-brown/8 space-y-5">
                  <h3 className="text-lg font-heading font-bold">Details</h3>
                  <div className="space-y-4 text-text-secondary">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-forest mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-text text-sm">Datum</p>
                        <p>
                          {formatDate(event.date)}
                          {event.endDate && event.endDate !== event.date && (
                            <> – {formatDate(event.endDate)}</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-forest mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-text text-sm">Ort</p>
                        <p>{event.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Tag className="w-5 h-5 text-forest mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-text text-sm">
                          Kategorie
                        </p>
                        <p className="capitalize">{event.kategorie}</p>
                      </div>
                    </div>
                  </div>

                  {isPast ? (
                    <div className="bg-brown/10 rounded-xl p-4 text-center">
                      <p className="text-text-secondary text-sm font-medium">
                        Diese Veranstaltung hat bereits stattgefunden.
                      </p>
                    </div>
                  ) : (
                    <Button
                      href="/kontakt"
                      variant="primary"
                      className="w-full"
                    >
                      Jetzt anmelden
                    </Button>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      {event.highlights.length > 0 && (
        <>
          <section className="bg-beige py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <div className="text-center mb-14">
                  <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                    Auf einen Blick
                  </p>
                  <h2 className="text-3xl sm:text-4xl">Highlights</h2>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.highlights.map((highlight, i) => (
                  <ScrollReveal key={highlight} delay={i * 80}>
                    <div className="flex items-start gap-3 bg-white rounded-xl p-5 border border-brown/8">
                      <CheckCircle2 className="w-5 h-5 text-forest mt-0.5 shrink-0" />
                      <p className="text-text-secondary leading-relaxed">
                        {highlight}
                      </p>
                    </div>
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
              {isPast
                ? "Neugierig geworden?"
                : "Bereit für dieses Erlebnis?"}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
              {isPast
                ? "Schauen Sie sich unsere aktuellen Termine an oder kontaktieren Sie uns für individuelle Anfragen."
                : "Kontaktieren Sie uns für Anmeldung und weitere Informationen — wir freuen uns auf Sie."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/kontakt" variant="primary" size="lg">
                Kontakt aufnehmen
              </Button>
              <Button
                href="/veranstaltungen"
                variant="secondary"
                size="lg"
                className="border-white/60 text-white hover:bg-white hover:text-text"
              >
                Alle Veranstaltungen
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
