import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { getBerlinCalendarDate } from "./dates";
import {
  ContentValidationError,
  issue,
  issuesFromZodError,
  type ContentIssue,
} from "./errors";
import { validateImage } from "./images";
import {
  filenameSlugIsValid,
  listMarkdownFiles,
  readJsonDocument,
  readMarkdownDocument,
  type JsonDocument,
  type MarkdownDocument,
} from "./readers";
import {
  accommodationPageSchema,
  aboutPageSchema,
  announcementSchema,
  contactPageSchema,
  eventSchema,
  eventsPageSchema,
  galleryImageSchema,
  galleryPageSchema,
  homePageSchema,
  horseSchema,
  horsesPageSchema,
  legalPageSchema,
  legalSettingsSchema,
  offerSchema,
  offersPageSchema,
  pricesPageSchema,
  siteSettingsSchema,
  teamMemberSchema,
  type AccommodationPageContent,
  type AboutPageContent,
  type Announcement,
  type ContactPageContent,
  type Event,
  type EventsPageContent,
  type GalleryImage,
  type GalleryPageContent,
  type HomePageContent,
  type Horse,
  type HorsesPageContent,
  type LegalPageContent,
  type LegalSettings,
  type Offer,
  type OffersPageContent,
  type Price,
  type PricesPageContent,
  type SeoSettings,
  type SiteSettings,
  type TeamMember,
} from "./schemas";
import {
  materializeEvent,
  materializeHorse,
  resolveSeo,
  selectActiveAnnouncements,
  selectFeaturedHomeEvent,
  selectFeaturedHomeOffers,
  selectPastEvents,
  selectPublished,
  selectUpcomingEvents,
  sortByOrderThenLabel,
} from "./selectors";

export * from "./dates";
export * from "./errors";
export * from "./images";
export * from "./readers";
export * from "./schemas";
export * from "./selectors";

interface ContentSnapshot {
  site: SiteSettings;
  home: HomePageContent;
  about: AboutPageContent;
  contact: ContactPageContent;
  offersPage: OffersPageContent;
  eventsPage: EventsPageContent;
  horsesPage: HorsesPageContent;
  pricesPage: PricesPageContent;
  galleryPage: GalleryPageContent;
  accommodationPage: AccommodationPageContent;
  legal: LegalSettings;
  imprint: LegalPageContent;
  privacy: LegalPageContent;
  offers: Offer[];
  events: Event[];
  team: TeamMember[];
  horses: Horse[];
  gallery: GalleryImage[];
  announcements: Announcement[];
}

interface BuildResult {
  snapshot?: ContentSnapshot;
  issues: ContentIssue[];
}

const singletonFiles = {
  site: "settings/site.json",
  home: "pages/home.json",
  about: "pages/about.json",
  contact: "pages/contact.json",
  offersPage: "pages/offers.json",
  eventsPage: "pages/events.json",
  horsesPage: "pages/horses.json",
  pricesPage: "pages/prices.json",
  galleryPage: "pages/gallery.json",
  accommodationPage: "pages/accommodation.json",
  legal: "settings/legal.json",
} as const;

const PLACEHOLDERS = [
  /\[wird ergänzt\]/i,
  /kontakt@example\.com/i,
  /\[hier folgt\b/i,
  /YOUR_GITHUB_ORG/i,
  /YOUR_REPOSITORY/i,
  /YOUR-OAUTH-BRIDGE/i,
];

function scanPlaceholders(
  value: unknown,
  filePath: string,
  issues: ContentIssue[],
  field = "Inhalt"
): void {
  if (typeof value === "string") {
    if (value !== "" && PLACEHOLDERS.some((pattern) => pattern.test(value))) {
      issues.push(
        issue(
          filePath,
          field,
          "Dieser Wert enthält noch einen Platzhalter und darf nicht veröffentlicht werden."
        )
      );
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      scanPlaceholders(entry, filePath, issues, `${field}.${index}`)
    );
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, entry]) =>
      scanPlaceholders(entry, filePath, issues, field === "Inhalt" ? key : `${field}.${key}`)
    );
  }
}

function readJsonSafely(
  relativePath: string,
  issues: ContentIssue[]
): JsonDocument | undefined {
  try {
    const document = readJsonDocument(relativePath);
    scanPlaceholders(document.data, document.filePath, issues);
    return document;
  } catch (error) {
    issues.push(
      issue(
        path.join(process.cwd(), "content", relativePath),
        "Datei",
        error instanceof Error ? error.message : "Die JSON-Datei kann nicht gelesen werden."
      )
    );
    return undefined;
  }
}

function parseJson<T>(
  relativePath: string,
  schema: z.ZodType<T>,
  issues: ContentIssue[]
): { value?: T; filePath: string } {
  const document = readJsonSafely(relativePath, issues);
  const filePath =
    document?.filePath ?? path.join(process.cwd(), "content", relativePath);
  if (!document) return { filePath };

  const parsed = schema.safeParse(document.data);
  if (!parsed.success) {
    issues.push(...issuesFromZodError(filePath, parsed.error));
    return { filePath };
  }
  return { value: parsed.data, filePath };
}

function parseMarkdownCollection<T>(
  directory: string,
  schema: z.ZodType<T>,
  issues: ContentIssue[]
): Array<{ value: T; document: MarkdownDocument }> {
  const seen = new Set<string>();
  const output: Array<{ value: T; document: MarkdownDocument }> = [];
  let relativePaths: string[] = [];

  try {
    relativePaths = listMarkdownFiles(directory);
  } catch (error) {
    issues.push(
      issue(
        path.join(process.cwd(), "content", directory),
        "Datei",
        error instanceof Error
          ? error.message
          : "Die Markdown-Sammlung kann nicht gelesen werden."
      )
    );
  }

  for (const relativePath of relativePaths) {
    let document: MarkdownDocument;
    try {
      document = readMarkdownDocument(relativePath);
    } catch (error) {
      issues.push(
        issue(
          path.join(process.cwd(), "content", relativePath),
          "Datei",
          error instanceof Error
            ? error.message
            : "Die Markdown-Datei kann nicht gelesen werden."
        )
      );
      continue;
    }
    scanPlaceholders(document.data, document.filePath, issues);
    scanPlaceholders(document.body, document.filePath, issues, "body");

    const slugKey = document.slug.toLocaleLowerCase("de");
    if (!filenameSlugIsValid(document.slug)) {
      issues.push(
        issue(
          document.filePath,
          "Dateiname",
          "Der Dateiname darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten."
        )
      );
    }
    if (seen.has(slugKey)) {
      issues.push(
        issue(document.filePath, "Dateiname", `Der Slug ${document.slug} ist doppelt vorhanden.`)
      );
    }
    seen.add(slugKey);

    const source = {
      ...(document.data as Record<string, unknown>),
      body: document.body,
    };
    const parsed = schema.safeParse(source);
    if (!parsed.success) {
      issues.push(...issuesFromZodError(document.filePath, parsed.error));
      continue;
    }
    output.push({ value: parsed.data, document });
  }
  return output;
}

function parseLegalPage(
  relativePath: string,
  issues: ContentIssue[]
): { value?: LegalPageContent; filePath: string } {
  const filePath = path.join(process.cwd(), "content", relativePath);
  try {
    const document = readMarkdownDocument(relativePath);
    scanPlaceholders(document.data, document.filePath, issues);
    scanPlaceholders(document.body, document.filePath, issues, "body");
    const parsed = legalPageSchema.safeParse({
      ...(document.data as Record<string, unknown>),
      body: document.body,
    });
    if (!parsed.success) {
      issues.push(...issuesFromZodError(document.filePath, parsed.error));
      return { filePath };
    }
    return { value: parsed.data, filePath };
  } catch (error) {
    issues.push(
      issue(
        filePath,
        "Datei",
        error instanceof Error ? error.message : "Die Markdown-Datei kann nicht gelesen werden."
      )
    );
    return { filePath };
  }
}

function validateImageField(
  src: string | undefined,
  filePath: string,
  field: string,
  issues: ContentIssue[]
) {
  if (!src) return undefined;
  const result = validateImage(src, filePath, field);
  issues.push(...result.issues);
  return result.metadata;
}

function validateSeoImages(
  seo: SeoSettings | undefined,
  filePath: string,
  issues: ContentIssue[]
) {
  validateImageField(seo?.socialImage, filePath, "seo.socialImage", issues);
}

function relationIssue(
  filePath: string,
  field: string,
  label: string
): ContentIssue {
  return issue(
    filePath,
    field,
    `Der verknüpfte Eintrag „${label}“ fehlt oder ist nicht veröffentlicht.`
  );
}

function validateAdminPlaceholders(issues: ContentIssue[]) {
  const adminConfigPath = path.join(process.cwd(), "public/admin/config.yml");
  if (!fs.existsSync(adminConfigPath)) return;
  const config = fs.readFileSync(adminConfigPath, "utf8");
  scanPlaceholders(config, adminConfigPath, issues, "Konfiguration");
}

function buildContentSnapshot(options: { validateAdmin?: boolean } = {}): BuildResult {
  const issues: ContentIssue[] = [];

  const site = parseJson(singletonFiles.site, siteSettingsSchema, issues);
  const home = parseJson(singletonFiles.home, homePageSchema, issues);
  const about = parseJson(singletonFiles.about, aboutPageSchema, issues);
  const contact = parseJson(singletonFiles.contact, contactPageSchema, issues);
  const offersPage = parseJson(singletonFiles.offersPage, offersPageSchema, issues);
  const eventsPage = parseJson(singletonFiles.eventsPage, eventsPageSchema, issues);
  const horsesPage = parseJson(singletonFiles.horsesPage, horsesPageSchema, issues);
  const pricesPage = parseJson(singletonFiles.pricesPage, pricesPageSchema, issues);
  const galleryPage = parseJson(singletonFiles.galleryPage, galleryPageSchema, issues);
  const accommodationPage = parseJson(
    singletonFiles.accommodationPage,
    accommodationPageSchema,
    issues
  );
  const legal = parseJson(singletonFiles.legal, legalSettingsSchema, issues);
  const imprint = parseLegalPage("legal/imprint.md", issues);
  const privacy = parseLegalPage("legal/privacy.md", issues);

  const offerRecords = parseMarkdownCollection("offers", offerSchema, issues);
  const offers: Offer[] = offerRecords.map(({ value, document }) => ({
    ...value,
    slug: document.slug,
  }));

  const eventRecords = parseMarkdownCollection("events", eventSchema, issues);
  const events: Event[] = eventRecords.map(({ value, document }) =>
    materializeEvent({ ...value, slug: document.slug })
  );

  const teamRecords = parseMarkdownCollection("team", teamMemberSchema, issues);
  const team: TeamMember[] = teamRecords.map(({ value, document }) => ({
    ...value,
    slug: document.slug,
  }));

  const horseRecords = parseMarkdownCollection("horses", horseSchema, issues);
  const horses: Horse[] = horseRecords.map(({ value, document }) =>
    materializeHorse({ ...value, slug: document.slug })
  );

  const galleryRecords = parseMarkdownCollection("gallery", galleryImageSchema, issues);
  const gallery: GalleryImage[] = galleryRecords.map(({ value, document }) => {
    const metadata = validateImageField(value.src, document.filePath, "src", issues);
    return {
      ...value,
      slug: document.slug,
      width: metadata?.width ?? 1,
      height: metadata?.height ?? 1,
    };
  });

  const announcementRecords = parseMarkdownCollection(
    "announcements",
    announcementSchema,
    issues
  );
  const announcements: Announcement[] = announcementRecords.map(
    ({ value, document }) => ({ ...value, slug: document.slug })
  );

  validateImageField(
    site.value?.defaultSocialImage,
    site.filePath,
    "defaultSocialImage",
    issues
  );

  if (home.value) {
    for (const field of [
      "heroImage",
      "heroWatercolorImage",
      "welcomeImage",
      "contactImage",
    ] as const) {
      validateImageField(home.value[field], home.filePath, field, issues);
    }
    validateSeoImages(home.value.seo, home.filePath, issues);
  }

  if (about.value) {
    validateImageField(
      about.value.philosophyImage,
      about.filePath,
      "philosophyImage",
      issues
    );
    validateSeoImages(about.value.seo, about.filePath, issues);
  }
  for (const page of [
    contact,
    offersPage,
    eventsPage,
    horsesPage,
    pricesPage,
    galleryPage,
    accommodationPage,
  ]) {
    validateSeoImages(page.value?.seo, page.filePath, issues);
  }

  for (const { value, document } of offerRecords) {
    validateImageField(value.imageSrc, document.filePath, "imageSrc", issues);
    validateSeoImages(value.seo, document.filePath, issues);
  }
  for (const { value, document } of eventRecords) {
    validateImageField(value.imageSrc, document.filePath, "imageSrc", issues);
    validateSeoImages(value.seo, document.filePath, issues);
  }
  for (const { value, document } of teamRecords) {
    validateImageField(value.imageSrc, document.filePath, "imageSrc", issues);
  }
  for (const { value, document } of horseRecords) {
    validateImageField(value.imageSrc, document.filePath, "imageSrc", issues);
  }

  const publishedOffers = new Set(
    offers.filter((entry) => entry.published).map((entry) => entry.slug)
  );
  const publishedEvents = new Set(
    events.filter((entry) => entry.published).map((entry) => entry.slug)
  );
  const publishedHorses = new Set(
    horses.filter((entry) => entry.published).map((entry) => entry.slug)
  );

  if (home.value) {
    home.value.featuredOffers.forEach((slug, index) => {
      if (!publishedOffers.has(slug)) {
        issues.push(
          relationIssue(home.filePath, `featuredOffers.${index}`, slug)
        );
      }
    });
    if (home.value.featuredEvent) {
      const event = events.find((entry) => entry.slug === home.value?.featuredEvent);
      if (
        !event ||
        !event.published ||
        event.state === "cancelled" ||
        event.chronology === "past"
      ) {
        issues.push(
          issue(
            home.filePath,
            "featuredEvent",
            `Die hervorgehobene Veranstaltung „${home.value.featuredEvent}“ fehlt, ist verborgen, abgesagt oder bereits vorbei.`
          )
        );
      }
    }
  }

  eventRecords.forEach(({ value, document }) => {
    if (value.relatedOffer && !publishedOffers.has(value.relatedOffer)) {
      issues.push(relationIssue(document.filePath, "relatedOffer", value.relatedOffer));
    }
  });

  galleryRecords.forEach(({ value, document }) => {
    if (value.relatedHorse && !publishedHorses.has(value.relatedHorse)) {
      issues.push(relationIssue(document.filePath, "relatedHorse", value.relatedHorse));
    }
    if (value.relatedEvent && !publishedEvents.has(value.relatedEvent)) {
      issues.push(relationIssue(document.filePath, "relatedEvent", value.relatedEvent));
    }
  });

  if (options.validateAdmin) validateAdminPlaceholders(issues);

  const allSingletons = [
    site.value,
    home.value,
    about.value,
    contact.value,
    offersPage.value,
    eventsPage.value,
    horsesPage.value,
    pricesPage.value,
    galleryPage.value,
    accommodationPage.value,
    legal.value,
    imprint.value,
    privacy.value,
  ];
  if (allSingletons.some((entry) => entry === undefined)) {
    return { issues };
  }

  return {
    issues,
    snapshot: {
      site: {
        ...site.value!,
        heroImage: home.value!.heroImage,
        heroWatercolorImage: home.value!.heroWatercolorImage,
      },
      home: home.value!,
      about: about.value!,
      contact: contact.value!,
      offersPage: offersPage.value!,
      eventsPage: eventsPage.value!,
      horsesPage: horsesPage.value!,
      pricesPage: pricesPage.value!,
      galleryPage: galleryPage.value!,
      accommodationPage: accommodationPage.value!,
      legal: legal.value!,
      imprint: imprint.value!,
      privacy: privacy.value!,
      offers,
      events: events.map((event) => ({
        ...event,
        featured: home.value?.featuredEvent === event.slug,
      })),
      team,
      horses,
      gallery,
      announcements,
    },
  };
}

let snapshotCache: ContentSnapshot | undefined;

function getSnapshot(): ContentSnapshot {
  const mayCache = process.env.NODE_ENV === "production";
  if (mayCache && snapshotCache) return snapshotCache;
  const result = buildContentSnapshot();
  if (result.issues.length > 0 || !result.snapshot) {
    throw new ContentValidationError(result.issues);
  }
  if (mayCache) snapshotCache = result.snapshot;
  return result.snapshot;
}

export function clearContentCache(): void {
  snapshotCache = undefined;
}

export function validateAllContent(options: { validateAdmin?: boolean } = {}): void {
  const result = buildContentSnapshot(options);
  if (result.issues.length > 0 || !result.snapshot) {
    throw new ContentValidationError(result.issues);
  }
}

export function getSiteSettings(): SiteSettings {
  return getSnapshot().site;
}

export function getHomePageContent(): HomePageContent {
  return getSnapshot().home;
}

export function getAboutPageContent(): AboutPageContent {
  return getSnapshot().about;
}

export function getContactPageContent(): ContactPageContent {
  return getSnapshot().contact;
}

export function getOffersPageContent(): OffersPageContent {
  return getSnapshot().offersPage;
}

export function getEventsPageContent(): EventsPageContent {
  return getSnapshot().eventsPage;
}

export function getHorsesPageContent(): HorsesPageContent {
  return getSnapshot().horsesPage;
}

export function getPricesPageContent(): PricesPageContent {
  return getSnapshot().pricesPage;
}

export function getGalleryPageContent(): GalleryPageContent {
  return getSnapshot().galleryPage;
}

export function getAccommodationPageContent(): AccommodationPageContent {
  return getSnapshot().accommodationPage;
}

export function getLegalSettings(): LegalSettings {
  return getSnapshot().legal;
}

export function getImprintContent(): LegalPageContent {
  return getSnapshot().imprint;
}

export function getPrivacyContent(): LegalPageContent {
  return getSnapshot().privacy;
}

export function getOffers(): Offer[] {
  return sortByOrderThenLabel(selectPublished(getSnapshot().offers));
}

export function getOfferBySlug(slug: string): Offer | undefined {
  return getOffers().find((offer) => offer.slug === slug);
}

export function getEvents(): Event[] {
  return getSnapshot().events.filter((event) => event.published);
}

export function getEventBySlug(slug: string): Event | undefined {
  return getEvents().find((event) => event.slug === slug);
}

export function getUpcomingEvents(): Event[] {
  return selectUpcomingEvents(getSnapshot().events);
}

export function getPastEvents(): Event[] {
  return selectPastEvents(getSnapshot().events);
}

export function getTeamMembers(): TeamMember[] {
  return sortByOrderThenLabel(selectPublished(getSnapshot().team));
}

export function getHorses(): Horse[] {
  return sortByOrderThenLabel(selectPublished(getSnapshot().horses));
}

export function getGalleryImages(): GalleryImage[] {
  return sortByOrderThenLabel(selectPublished(getSnapshot().gallery));
}

export function getAnnouncements(): Announcement[] {
  return sortByOrderThenLabel(getSnapshot().announcements);
}

export function getActiveAnnouncements(referenceDate = new Date()): Announcement[] {
  return selectActiveAnnouncements(
    getSnapshot().announcements,
    getBerlinCalendarDate(referenceDate)
  );
}

export function getFeaturedHomeOffers(limit = 3): Offer[] {
  return selectFeaturedHomeOffers(getSnapshot().home, getSnapshot().offers).slice(
    0,
    limit
  );
}

export function getFeaturedUpcomingEvent(): Event | undefined {
  return selectFeaturedHomeEvent(getSnapshot().home, getSnapshot().events);
}

export function getPrices(): Price[] {
  return getOffers()
    .filter((offer) => offer.showOnPricesPage)
    .flatMap((offer) =>
      offer.pricingOptions.map((option, index) => ({
        slug:
          offer.pricingOptions.length === 1
            ? offer.slug
            : `${offer.slug}-${index + 1}`,
        title:
          offer.pricingOptions.length === 1
            ? offer.title
            : `${offer.title} – ${option.label}`,
        price: option.price,
        unit: option.unit ?? "",
        features: option.features,
        highlighted: option.highlighted,
        published: offer.published,
        sortOrder: offer.sortOrder,
      }))
    );
}

export function getContactSubjects(): string[] {
  return [
    ...getOffers().map((offer) => offer.title),
    "Pferdeunterbringung",
    "Allgemeine Anfrage",
  ];
}

export { resolveSeo };
