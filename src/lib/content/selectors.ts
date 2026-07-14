import {
  calculateAgeFromBirthYear,
  getBerlinCalendarDate,
  getEventChronology,
  isWithinDateWindow,
} from "./dates";
import type {
  Announcement,
  Event,
  EventContent,
  HomePageContent,
  Horse,
  HorseContent,
  Offer,
  SeoSettings,
  SiteSettings,
} from "./schemas";

export function sortByOrderThenLabel<
  T extends { sortOrder?: number; title?: string; name?: string },
>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => {
    const byOrder = (a.sortOrder ?? 100) - (b.sortOrder ?? 100);
    if (byOrder !== 0) return byOrder;
    return (a.title ?? a.name ?? "").localeCompare(
      b.title ?? b.name ?? "",
      "de"
    );
  });
}

export function materializeEvent(
  event: EventContent & { slug: string },
  today = getBerlinCalendarDate()
): Event {
  const chronology = getEventChronology(event, today);
  return {
    ...event,
    chronology,
    kategorie: event.category,
    status: event.state === "cancelled" ? "cancelled" : chronology,
  };
}

export function materializeHorse(
  horse: HorseContent & { slug: string },
  referenceDate = new Date()
): Horse {
  const age = horse.birthYear
    ? `${calculateAgeFromBirthYear(horse.birthYear, referenceDate)} Jahre`
    : horse.ageText;
  return {
    ...horse,
    age,
    role: horse.roles.join(", "),
  };
}

export function selectPublished<T extends { published: boolean }>(
  entries: readonly T[]
): T[] {
  return entries.filter((entry) => entry.published);
}

export function selectFeaturedHomeOffers(
  home: HomePageContent,
  offers: readonly Offer[]
): Offer[] {
  const bySlug = new Map(
    offers.filter((offer) => offer.published).map((offer) => [offer.slug, offer])
  );
  return home.featuredOffers
    .map((slug) => bySlug.get(slug))
    .filter((offer): offer is Offer => Boolean(offer));
}

export function selectFeaturedHomeEvent(
  home: HomePageContent,
  events: readonly Event[],
  today = getBerlinCalendarDate()
): Event | undefined {
  if (!home.featuredEvent) return undefined;
  const event = events.find(
    (candidate) =>
      candidate.slug === home.featuredEvent &&
      candidate.published &&
      candidate.state !== "cancelled"
  );
  if (!event) return undefined;
  return getEventChronology(event, today) === "upcoming" ? event : undefined;
}

export function selectUpcomingEvents(
  events: readonly Event[],
  today = getBerlinCalendarDate()
): Event[] {
  return events
    .filter(
      (event) =>
        event.published && getEventChronology(event, today) === "upcoming"
    )
    .sort((a, b) => {
      const byDate = a.date.localeCompare(b.date);
      return byDate || (a.sortOrder ?? 100) - (b.sortOrder ?? 100);
    });
}

export function selectPastEvents(
  events: readonly Event[],
  today = getBerlinCalendarDate()
): Event[] {
  return events
    .filter(
      (event) => event.published && getEventChronology(event, today) === "past"
    )
    .sort((a, b) => {
      const byDate = b.date.localeCompare(a.date);
      return byDate || (a.sortOrder ?? 100) - (b.sortOrder ?? 100);
    });
}

export function selectActiveAnnouncements(
  announcements: readonly Announcement[],
  today = getBerlinCalendarDate()
): Announcement[] {
  return sortByOrderThenLabel(
    announcements.filter(
      (announcement) =>
        announcement.enabled && isWithinDateWindow(announcement, today)
    )
  );
}

export interface ResolvedSeo {
  title: string;
  description: string;
  socialImage: string;
  socialImageAlt: string;
  noIndex: boolean;
}

export function resolveSeo(
  seo: SeoSettings | undefined,
  fallback: { title: string; description?: string; image?: string; imageAlt?: string },
  site: SiteSettings
): ResolvedSeo {
  return {
    title: seo?.title || fallback.title,
    description: seo?.description || fallback.description || site.defaultDescription,
    socialImage:
      seo?.socialImage || fallback.image || site.defaultSocialImage,
    socialImageAlt:
      seo?.socialImageAlt ||
      fallback.imageAlt ||
      site.defaultSocialImageAlt,
    noIndex: seo?.noIndex ?? false,
  };
}
