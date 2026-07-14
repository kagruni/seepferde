import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import {
  getEventsPageContent,
  getPastEvents,
  getUpcomingEvents,
  type Event,
} from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const page = getEventsPageContent();
  return buildPageMetadata(page.seo, {
    title: page.title,
    description: page.intro,
  });
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function Veranstaltungen() {
  const page = getEventsPageContent();
  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();

  return (
    <>
      <section className="bg-beige pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
              {page.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              {page.title}
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl">{page.intro}</p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-10">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                {page.upcomingEyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl">{page.upcomingTitle}</h2>
            </div>
          </ScrollReveal>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <ScrollReveal key={event.slug} delay={index * 100} className="h-full">
                  <EventCard event={event} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-beige p-8 text-center text-text-secondary" role="status">
              {page.emptyState}
            </p>
          )}
        </div>
      </section>

      {pastEvents.length > 0 ? (
        <section className="bg-beige py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="mb-10">
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                  {page.pastEyebrow}
                </p>
                <h2 className="text-3xl sm:text-4xl">{page.pastTitle}</h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event, index) => (
                <ScrollReveal key={event.slug} delay={index * 100} className="h-full">
                  <EventCard event={event} muted />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {page.ctaTitle && page.ctaLabel ? (
        <section className="bg-[#3D2A35] text-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl text-white mb-4">{page.ctaTitle}</h2>
              {page.ctaBody ? (
                <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
                  {page.ctaBody}
                </p>
              ) : null}
              <Button href="/kontakt" variant="primary" size="lg">
                {page.ctaLabel}
              </Button>
            </ScrollReveal>
          </div>
        </section>
      ) : null}
    </>
  );
}

function EventCard({ event, muted = false }: { event: Event; muted?: boolean }) {
  const badge =
    event.state === "cancelled"
      ? "Abgesagt"
      : event.state === "sold_out"
        ? "Ausgebucht"
        : event.category === "seminar"
          ? "Seminar"
          : "Workshop";

  return (
    <Link
      href={`/veranstaltungen/${event.slug}`}
      className={`group block h-full overflow-hidden rounded-2xl border border-brown/8 transition-shadow hover:shadow-md ${muted ? "bg-white" : "bg-cream"}`}
    >
      <div className="relative aspect-[16/10]">
        <Image src={event.imageSrc} alt={event.imageAlt} fill className="object-cover" />
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white ${event.state === "cancelled" ? "bg-red-700" : event.state === "sold_out" ? "bg-brown" : "bg-forest"}`}>
          {badge}
        </span>
      </div>
      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-3 text-sm text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-forest" />
            {formatDate(event.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-forest" />
            {event.location}
          </span>
        </div>
        <h3 className="mb-2 text-xl font-heading font-bold transition-colors group-hover:text-forest">
          {event.title}
        </h3>
        <p className="text-sm leading-relaxed text-text-secondary">{event.description}</p>
      </div>
    </Link>
  );
}
