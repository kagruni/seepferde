import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  Announcement,
  Event,
  GalleryImage,
  HomePageContent,
  Horse,
  Angebot,
  Price,
  SiteSettings,
} from "@/types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function readJsonFile<T>(relativePath: string): T {
  const fullPath = path.join(CONTENT_ROOT, relativePath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8")) as T;
}

function readMarkdownCollection<T extends Record<string, unknown>>(
  directory: string
): Array<{ body: string; filePath: string } & T> {
  const fullDir = path.join(CONTENT_ROOT, directory);
  if (!fs.existsSync(fullDir)) {
    return [];
  }

  return fs
    .readdirSync(fullDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(fullDir, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = matter(raw);
      return {
        ...(parsed.data as T),
        body: parsed.content.trim(),
        filePath,
      };
    });
}

function assertString(value: unknown, field: string, filePath: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid "${field}" in ${filePath}`);
  }
  return value;
}

function assertBoolean(
  value: unknown,
  field: string,
  filePath: string
): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`Invalid "${field}" in ${filePath}`);
  }
  return value;
}

function assertStringArray(
  value: unknown,
  field: string,
  filePath: string
): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Invalid "${field}" in ${filePath}`);
  }
  return value;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function assertNumber(value: unknown, field: string, filePath: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Invalid "${field}" in ${filePath}`);
  }
  return value;
}

function normalizeDate(value: unknown, field: string, filePath: string): string {
  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  throw new Error(`Invalid "${field}" in ${filePath}`);
}

function optionalDate(value: unknown): string | undefined {
  if (!value) {
    return undefined;
  }
  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return undefined;
}

function assertEnum<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  field: string,
  filePath: string
): T {
  if (typeof value !== "string" || !allowedValues.includes(value as T)) {
    throw new Error(`Invalid "${field}" in ${filePath}`);
  }
  return value as T;
}

function sortByOrderThenTitle<T extends { sortOrder?: number; title?: string; name?: string }>(
  items: T[]
) {
  return [...items].sort((a, b) => {
    const orderA = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) {
      return orderA - orderB;
    }

    const labelA = a.title ?? a.name ?? "";
    const labelB = b.title ?? b.name ?? "";
    return labelA.localeCompare(labelB, "de");
  });
}

function ensureUniqueSlugs(
  items: Array<{ slug: string }>,
  collection: string
) {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.slug)) {
      throw new Error(`Duplicate slug "${item.slug}" in ${collection}`);
    }
    seen.add(item.slug);
  }
}

function validateImagePath(src: string, filePath: string) {
  if (!src.startsWith("/")) {
    throw new Error(`Image path must be absolute in ${filePath}`);
  }

  const publicPath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  if (!fs.existsSync(publicPath)) {
    throw new Error(`Missing image asset "${src}" referenced in ${filePath}`);
  }
}

let siteSettingsCache: SiteSettings | null = null;
let homePageCache: HomePageContent | null = null;
let horsesCache: Horse[] | null = null;
let offersCache: Angebot[] | null = null;
let eventsCache: Event[] | null = null;
let pricesCache: Price[] | null = null;
let announcementsCache: Announcement[] | null = null;
let galleryCache: GalleryImage[] | null = null;

export function getSiteSettings(): SiteSettings {
  if (siteSettingsCache) return siteSettingsCache;

  const data = readJsonFile<SiteSettings>("settings/site.json");
  data.navLinks.forEach((link, index) => {
    assertString(link.label, `navLinks[${index}].label`, "content/settings/site.json");
    assertString(link.href, `navLinks[${index}].href`, "content/settings/site.json");
  });
  data.contactSubjects = assertStringArray(
    data.contactSubjects,
    "contactSubjects",
    "content/settings/site.json"
  );

  siteSettingsCache = data;
  return siteSettingsCache;
}

export function getHomePageContent(): HomePageContent {
  if (homePageCache) return homePageCache;
  homePageCache = readJsonFile<HomePageContent>("settings/home.json");
  return homePageCache;
}

export function getHorses(): Horse[] {
  if (horsesCache) return horsesCache;

  const horses = readMarkdownCollection<Record<string, unknown>>("horses").map(
    (item) => {
      validateImagePath(assertString(item.imageSrc, "imageSrc", item.filePath), item.filePath);
      return {
        slug: assertString(item.slug, "slug", item.filePath),
        name: assertString(item.name, "name", item.filePath),
        breed: assertString(item.breed, "breed", item.filePath),
        age: optionalString(item.age),
        character: assertString(item.character, "character", item.filePath),
        role: assertString(item.role, "role", item.filePath),
        imageSrc: assertString(item.imageSrc, "imageSrc", item.filePath),
        imageAlt: assertString(item.imageAlt, "imageAlt", item.filePath),
        published: assertBoolean(item.published, "published", item.filePath),
        sortOrder: optionalNumber(item.sortOrder),
      } satisfies Horse;
    }
  );

  ensureUniqueSlugs(horses, "horses");
  horsesCache = sortByOrderThenTitle(horses.filter((horse) => horse.published));
  return horsesCache;
}

export function getOffers(): Angebot[] {
  if (offersCache) return offersCache;

  const offers = readMarkdownCollection<Record<string, unknown>>("offers").map(
    (item) => {
      const imageSrc = assertString(item.imageSrc, "imageSrc", item.filePath);
      validateImagePath(imageSrc, item.filePath);
      return {
        title: assertString(item.title, "title", item.filePath),
        slug: assertString(item.slug, "slug", item.filePath),
        summary: assertString(item.summary, "summary", item.filePath),
        description: assertString(item.description, "description", item.filePath),
        category: assertEnum(
          item.category,
          ["seminar", "workshop"],
          "category",
          item.filePath
        ),
        imageSrc,
        imageAlt: assertString(item.imageAlt, "imageAlt", item.filePath),
        highlights: assertStringArray(item.highlights, "highlights", item.filePath),
        audience: Array.isArray(item.audience)
          ? assertStringArray(item.audience, "audience", item.filePath)
          : undefined,
        body: item.body,
        format: optionalString(item.format),
        specialNote: optionalString(item.specialNote),
        prerequisites: optionalString(item.prerequisites),
        participantCount: optionalString(item.participantCount),
        published: assertBoolean(item.published, "published", item.filePath),
        featured:
          typeof item.featured === "boolean" ? item.featured : false,
        sortOrder: optionalNumber(item.sortOrder),
      } satisfies Angebot;
    }
  );

  ensureUniqueSlugs(offers, "offers");
  offersCache = sortByOrderThenTitle(offers.filter((offer) => offer.published));
  return offersCache;
}

export function getOfferBySlug(slug: string): Angebot | undefined {
  return getOffers().find((offer) => offer.slug === slug);
}

export function getEvents(): Event[] {
  if (eventsCache) return eventsCache;

  const events = readMarkdownCollection<Record<string, unknown>>("events").map(
    (item) => {
      const imageSrc = assertString(item.imageSrc, "imageSrc", item.filePath);
      validateImagePath(imageSrc, item.filePath);
      const status = assertEnum(
        item.status,
        ["draft", "upcoming", "past", "cancelled"],
        "status",
        item.filePath
      );

      return {
        title: assertString(item.title, "title", item.filePath),
        slug: assertString(item.slug, "slug", item.filePath),
        date: normalizeDate(item.date, "date", item.filePath),
        endDate: optionalDate(item.endDate),
        location: assertString(item.location, "location", item.filePath),
        description: assertString(item.description, "description", item.filePath),
        body: item.body,
        imageSrc,
        imageAlt: assertString(item.imageAlt, "imageAlt", item.filePath),
        kategorie: assertEnum(
          item.kategorie,
          ["seminar", "workshop"],
          "kategorie",
          item.filePath
        ),
        highlights: assertStringArray(item.highlights, "highlights", item.filePath),
        status: status as Event["status"],
        featured:
          typeof item.featured === "boolean" ? item.featured : false,
        published: assertBoolean(item.published, "published", item.filePath),
        sortOrder: optionalNumber(item.sortOrder),
      } satisfies Event;
    }
  );

  ensureUniqueSlugs(events, "events");
  eventsCache = [...events]
    .filter((event) => event.published && event.status !== "draft")
    .sort((a, b) => {
      const orderA = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.date.localeCompare(b.date);
    });
  return eventsCache;
}

export function getEventBySlug(slug: string): Event | undefined {
  return getEvents().find((event) => event.slug === slug);
}

export function getPrices(): Price[] {
  if (pricesCache) return pricesCache;

  const prices = readMarkdownCollection<Record<string, unknown>>("prices").map(
    (item) =>
      ({
        slug: assertString(item.slug, "slug", item.filePath),
        title: assertString(item.title, "title", item.filePath),
        price: assertString(item.price, "price", item.filePath),
        unit: assertString(item.unit, "unit", item.filePath),
        features: assertStringArray(item.features, "features", item.filePath),
        highlighted:
          typeof item.highlighted === "boolean" ? item.highlighted : false,
        published: assertBoolean(item.published, "published", item.filePath),
        sortOrder: optionalNumber(item.sortOrder),
      }) satisfies Price
  );

  ensureUniqueSlugs(prices, "prices");
  pricesCache = sortByOrderThenTitle(prices.filter((price) => price.published));
  return pricesCache;
}

export function getAnnouncements(): Announcement[] {
  if (announcementsCache) return announcementsCache;

  const announcements = readMarkdownCollection<Record<string, unknown>>(
    "announcements"
  ).map(
    (item) =>
      ({
        title: assertString(item.title, "title", item.filePath),
        slug: assertString(item.slug, "slug", item.filePath),
        message: assertString(item.message, "message", item.filePath),
        enabled: assertBoolean(item.enabled, "enabled", item.filePath),
        variant: assertEnum(
          item.variant,
          ["info", "success", "warning"],
          "variant",
          item.filePath
        ),
        startDate: optionalDate(item.startDate),
        endDate: optionalDate(item.endDate),
        linkLabel: optionalString(item.linkLabel),
        linkHref: optionalString(item.linkHref),
        sortOrder: optionalNumber(item.sortOrder),
      }) satisfies Announcement
  );

  announcementsCache = sortByOrderThenTitle(
    announcements.filter((announcement) => announcement.enabled)
  );
  return announcementsCache;
}

export function getActiveAnnouncements(referenceDate = new Date()): Announcement[] {
  const today = referenceDate.toISOString().slice(0, 10);
  return getAnnouncements().filter((announcement) => {
    if (announcement.startDate && announcement.startDate > today) {
      return false;
    }
    if (announcement.endDate && announcement.endDate < today) {
      return false;
    }
    return true;
  });
}

export function getGalleryImages(): GalleryImage[] {
  if (galleryCache) return galleryCache;

  const images = readMarkdownCollection<Record<string, unknown>>("gallery").map(
    (item) => {
      const src = assertString(item.src, "src", item.filePath);
      validateImagePath(src, item.filePath);
      return {
        title: assertString(item.title, "title", item.filePath),
        src,
        alt: assertString(item.alt, "alt", item.filePath),
        category: assertEnum(
          item.category,
          ["hof", "pferde", "unterricht", "events"],
          "category",
          item.filePath
        ),
        width: assertNumber(item.width, "width", item.filePath),
        height: assertNumber(item.height, "height", item.filePath),
        published: assertBoolean(item.published, "published", item.filePath),
        sortOrder: optionalNumber(item.sortOrder),
      } satisfies GalleryImage;
    }
  );

  galleryCache = sortByOrderThenTitle(
    images.filter((image) => image.published)
  );
  return galleryCache;
}

export function getFeaturedHomeOffers(limit = 3): Angebot[] {
  return getOffers()
    .filter((offer) => offer.featured)
    .slice(0, limit);
}

export function getFeaturedUpcomingEvent(): Event | undefined {
  return getEvents().find((event) => event.featured && event.status === "upcoming");
}

export function getUpcomingEvents(): Event[] {
  return getEvents().filter((event) => event.status === "upcoming");
}

export function getPastEvents(): Event[] {
  return getEvents().filter((event) => event.status === "past");
}
