import { z } from "zod";
import {
  isCalendarDate,
  isLocalTime,
  normalizeCalendarDate,
} from "./dates";

const requiredString = (message = "Dieses Feld ist erforderlich.") =>
  z.string().trim().min(1, message);

const optionalString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional()
);

const optionalEmail = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse ein.").optional()
);

const optionalHttpsUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .trim()
    .url("Bitte geben Sie eine vollständige Webadresse ein.")
    .refine(
      (value) => value.startsWith("https://"),
      "Die Webadresse muss mit https:// beginnen."
    )
    .optional()
);

const dateString = z.preprocess(
  normalizeCalendarDate,
  z
    .string()
    .refine(isCalendarDate, "Bitte verwenden Sie ein gültiges Datum im Format JJJJ-MM-TT.")
);

const optionalDateString = z.preprocess(
  (value) => {
    const normalized = normalizeCalendarDate(value);
    return normalized === "" || normalized == null ? undefined : normalized;
  },
  z
    .string()
    .refine(isCalendarDate, "Bitte verwenden Sie ein gültiges Datum im Format JJJJ-MM-TT.")
    .optional()
);

const optionalTime = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z
    .string()
    .refine(isLocalTime, "Bitte verwenden Sie eine Uhrzeit im Format HH:mm.")
    .optional()
);

const imagePath = z
  .string()
  .trim()
  .regex(/^\/images\//, "Bitte wählen Sie ein Bild aus dem Medienbereich aus.");

const sortOrder = z.coerce.number().int().min(0).default(100);
const published = z.boolean().default(true);
const stringList = (minimum = 0, maximum = 8) =>
  z.array(requiredString()).min(minimum).max(maximum);

const internalOrExternalLink = z
  .string()
  .trim()
  .refine(
    (value) => /^\/(?!\/)/.test(value) || /^https:\/\//.test(value),
    "Der Link muss mit / oder https:// beginnen."
  );

export const seoSchema = z
  .object({
    title: optionalString,
    description: optionalString,
    socialImage: imagePath.optional(),
    socialImageAlt: optionalString,
    noIndex: z.boolean().default(false),
  })
  .default({ noIndex: false })
  .superRefine((seo, context) => {
    if (seo.socialImage && !seo.socialImageAlt) {
      context.addIssue({
        code: "custom",
        path: ["socialImageAlt"],
        message: "Bitte beschreiben Sie das Social-Media-Bild.",
      });
    }
  });

export type SeoSettings = z.infer<typeof seoSchema>;

function extractLegacyMapPoint(embedUrl: unknown) {
  if (typeof embedUrl !== "string") return undefined;
  const match = embedUrl.match(/[?&]marker=(-?\d+(?:\.\d+)?)%2C(-?\d+(?:\.\d+)?)/);
  if (!match) return undefined;
  return { latitude: Number(match[1]), longitude: Number(match[2]) };
}

const mapLocationSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    if (value.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(value) as unknown;
        if (parsed && typeof parsed === "object") {
          const point = parsed as Record<string, unknown>;
          if (point.type === "Point" && Array.isArray(point.coordinates)) {
            return {
              longitude: point.coordinates[0],
              latitude: point.coordinates[1],
            };
          }
        }
      } catch {
        return value;
      }
    }
    const [latitude, longitude] = value.split(",").map((part) => Number(part.trim()));
    return { latitude, longitude };
  }
  if (Array.isArray(value)) {
    return { longitude: value[0], latitude: value[1] };
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (record.type === "Point" && Array.isArray(record.coordinates)) {
      return {
        longitude: record.coordinates[0],
        latitude: record.coordinates[1],
      };
    }
    return {
      latitude: record.latitude ?? record.lat,
      longitude: record.longitude ?? record.lng ?? record.lon,
    };
  }
  return value;
}, z
  .object({
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
  })
  .transform((point) => ({
    type: "Point" as const,
    coordinates: [point.longitude, point.latitude] as [number, number],
  })));

export const siteSettingsSchema = z.preprocess((value) => {
  if (!value || typeof value !== "object") return value;
  const source = value as Record<string, unknown>;
  const legacyPoint = extractLegacyMapPoint(source.mapEmbedUrl);
  return {
    ...source,
    availabilityText: source.availabilityText ?? source.hours,
    street:
      source.street ??
      (typeof source.address === "string" ? source.address.split(",")[0]?.trim() : undefined),
    countryCode: source.countryCode ?? source.country,
    mapLocation: source.mapLocation ?? legacyPoint,
    defaultSocialImage: source.defaultSocialImage ?? source.ogImage,
    defaultSocialImageAlt:
      source.defaultSocialImageAlt ??
      (source.ogImage ? "See-Pferde Zwenkau am Zwenkauer See" : undefined),
  };
}, z
  .object({
    businessName: requiredString(),
    phone: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || /^\+?[0-9][0-9 ()/.-]{5,}$/.test(value),
        "Bitte lassen Sie das Feld leer oder geben Sie eine echte Telefonnummer mit Vorwahl ein."
      )
      .default(""),
    email: optionalEmail.default(""),
    availabilityText: requiredString(),
    footerNote: requiredString(),
    street: requiredString(),
    postalCode: z.string().regex(/^\d{5}$/, "Bitte geben Sie eine fünfstellige Postleitzahl ein."),
    city: requiredString(),
    countryCode: z.literal("DE").default("DE"),
    mapLocation: mapLocationSchema,
    defaultDescription: requiredString(),
    defaultSocialImage: imagePath,
    defaultSocialImageAlt: requiredString("Bitte beschreiben Sie das Vorschaubild."),
  })
  .transform((settings) => {
    const address = `${settings.street}, ${settings.postalCode} ${settings.city}`;
    const [longitude, latitude] = settings.mapLocation.coordinates;
    const marker = `${latitude}%2C${longitude}`;
    return {
      ...settings,
      address,
      country: settings.countryCode,
      hours: settings.availabilityText,
      mailtoEmail: settings.email,
      mapEmbedUrl: `https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${marker}`,
      ogImage: settings.defaultSocialImage,
      siteUrl: "https://mandykolatka.kajik.dev",
      defaultTitle:
        "See-Pferde Zwenkau - Pferdegestütztes Coaching & Workshops in Zwenkau",
      titleTemplate: "%s - See-Pferde Zwenkau",
      legalName: "Mandy Kolatka",
      heroImage: settings.defaultSocialImage,
      heroWatercolorImage: settings.defaultSocialImage,
      navLinks: [
        { label: "Willkommen", href: "/" },
        { label: "Angebote", href: "/angebote" },
        { label: "Workshops", href: "/veranstaltungen" },
        { label: "Hof-Infos", href: "/ueber-uns" },
        { label: "Kontakt", href: "/kontakt" },
      ],
      contactSubjects: [] as string[],
    };
  }));

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

const ctaTargetSchema = z.enum([
  "/kontakt",
  "/angebote",
  "/veranstaltungen",
  "/ueber-uns",
]);

export const homePageSchema = z.preprocess((value) => {
  if (!value || typeof value !== "object") return value;
  const source = value as Record<string, unknown>;
  return {
    ...source,
    primaryCtaLabel: source.primaryCtaLabel ?? source.heroPrimaryCtaLabel,
    primaryCtaTarget: source.primaryCtaTarget ?? "/kontakt",
    welcomeBody:
      source.welcomeBody ??
      (Array.isArray(source.welcomeParagraphs)
        ? source.welcomeParagraphs.join("\n\n")
        : undefined),
    eventEyebrow: source.eventEyebrow ?? source.eventsEyebrow,
    contactBody: source.contactBody ?? source.contactText,
  };
}, z
  .object({
    heroTitle: requiredString().max(70),
    heroSubtitle: requiredString(),
    heroImage: imagePath,
    heroImageAlt: requiredString("Bitte beschreiben Sie das Hero-Bild."),
    heroWatercolorImage: imagePath,
    primaryCtaLabel: requiredString().max(30),
    primaryCtaTarget: ctaTargetSchema,
    welcomeEyebrow: requiredString(),
    welcomeTitle: requiredString(),
    welcomeBody: requiredString(),
    welcomeImage: imagePath,
    welcomeImageAlt: requiredString("Bitte beschreiben Sie das Willkommensbild."),
    offersEyebrow: requiredString(),
    offersTitle: requiredString(),
    featuredOffers: z.array(requiredString()).min(1).max(3),
    eventEyebrow: requiredString(),
    featuredEvent: optionalString,
    contactEyebrow: requiredString(),
    contactTitle: requiredString(),
    contactBody: requiredString(),
    contactImage: imagePath,
    contactImageAlt: requiredString("Bitte beschreiben Sie das Kontaktbild."),
    contactHighlights: stringList(0, 4).default([]),
    contactCtaLabel: requiredString().max(30),
    seo: seoSchema,
  })
  .transform((home) => ({
    ...home,
    heroPrimaryCtaLabel: home.primaryCtaLabel,
    heroSecondaryCtaLabel: "Angebote entdecken",
    welcomeParagraphs: home.welcomeBody.split(/\n\s*\n/).filter(Boolean),
    eventsEyebrow: home.eventEyebrow,
    eventsTitle: "Aktuelle Termine",
    contactText: home.contactBody,
  })));

export type HomePageContent = z.infer<typeof homePageSchema>;

const pageBase = {
  eyebrow: requiredString(),
  title: requiredString(),
  intro: requiredString(),
  seo: seoSchema,
};

const ctaFields = {
  ctaTitle: optionalString,
  ctaBody: optionalString,
  ctaLabel: optionalString,
};

export const aboutPageSchema = z.object({
  ...pageBase,
  philosophyEyebrow: requiredString(),
  philosophyTitle: requiredString(),
  philosophyBody: requiredString(),
  philosophyImage: imagePath,
  philosophyImageAlt: requiredString(),
  teamEyebrow: requiredString(),
  teamTitle: requiredString(),
  teamIntro: optionalString,
  ctaLabel: requiredString(),
});

export const contactPageSchema = z.object({
  ...pageBase,
  formEyebrow: requiredString(),
  formTitle: requiredString(),
  contactEyebrow: requiredString(),
  contactTitle: requiredString(),
  availabilityNote: optionalString,
});

export const offersPageSchema = z.object({
  ...pageBase,
  ...ctaFields,
  seminarEyebrow: requiredString(),
  seminarTitle: requiredString(),
  workshopEyebrow: requiredString(),
  workshopTitle: requiredString(),
});

export const eventsPageSchema = z.object({
  ...pageBase,
  ...ctaFields,
  upcomingEyebrow: requiredString(),
  upcomingTitle: requiredString(),
  pastEyebrow: requiredString(),
  pastTitle: requiredString(),
  emptyState: requiredString(),
});

export const horsesPageSchema = z.object({
  ...pageBase,
  ...ctaFields,
  emptyState: requiredString(),
  closingTitle: optionalString,
  closingBody: optionalString,
  closingCtaLabel: optionalString,
});

export const pricesPageSchema = z.object({
  ...pageBase,
  ...ctaFields,
  disclaimerTitle: requiredString(),
  disclaimerBody: requiredString(),
  companyNote: optionalString,
});

export const galleryPageSchema = z.object({
  ...pageBase,
  ...ctaFields,
  categoryLabels: z.object({
    hof: requiredString(),
    pferde: requiredString(),
    coaching: requiredString(),
    workshops: requiredString(),
    events: requiredString(),
  }),
  emptyState: requiredString(),
});

const accommodationOptionSchema = z.object({
  title: requiredString(),
  availability: requiredString(),
  price: requiredString(),
  note: optionalString,
});

export const accommodationPageSchema = z.object({
  ...pageBase,
  options: z.array(accommodationOptionSchema).min(1).max(6),
  extrasTitle: requiredString(),
  extrasBody: requiredString(),
  bookingTitle: requiredString(),
  bookingBody: requiredString(),
  bookingCtaLabel: requiredString().max(30),
});

export type AboutPageContent = z.infer<typeof aboutPageSchema>;
export type ContactPageContent = z.infer<typeof contactPageSchema>;
export type OffersPageContent = z.infer<typeof offersPageSchema>;
export type EventsPageContent = z.infer<typeof eventsPageSchema>;
export type HorsesPageContent = z.infer<typeof horsesPageSchema>;
export type PricesPageContent = z.infer<typeof pricesPageSchema>;
export type GalleryPageContent = z.infer<typeof galleryPageSchema>;
export type AccommodationPageContent = z.infer<typeof accommodationPageSchema>;

const pricingOptionSchema = z.object({
  label: requiredString(),
  price: requiredString(),
  unit: optionalString,
  features: stringList(0, 8).default([]),
  highlighted: z.boolean().default(false),
});

export const offerSchema = z.preprocess((value) => {
  if (!value || typeof value !== "object") return value;
  const source = value as Record<string, unknown>;
  const options = Array.isArray(source.pricingOptions) ? source.pricingOptions : [];
  return {
    ...source,
    pricingOptions: options,
    showOnPricesPage: source.showOnPricesPage ?? options.length > 0,
  };
}, z
  .object({
    title: requiredString(),
    published,
    category: z.enum(["seminar", "workshop"]),
    summary: requiredString().max(180, "Die Kurzbeschreibung darf höchstens 180 Zeichen lang sein."),
    description: requiredString(),
    body: requiredString(),
    imageSrc: imagePath,
    imageAlt: requiredString("Bitte beschreiben Sie, was auf dem Bild zu sehen ist."),
    highlights: stringList(1, 8),
    audience: stringList(0, 8).optional(),
    format: optionalString,
    participantCount: optionalString,
    prerequisites: optionalString,
    specialNote: optionalString,
    pricingOptions: z.array(pricingOptionSchema).default([]),
    showOnPricesPage: z.boolean().default(true),
    sortOrder,
    seo: seoSchema,
  })
  .superRefine((offer, context) => {
    if (offer.showOnPricesPage && offer.pricingOptions.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["pricingOptions"],
        message: "Für die Anzeige auf der Preisseite ist mindestens eine Preisoption erforderlich.",
      });
    }
    if (offer.pricingOptions.filter((option) => option.highlighted).length > 1) {
      context.addIssue({
        code: "custom",
        path: ["pricingOptions"],
        message: "Pro Angebot darf höchstens eine Preisoption hervorgehoben sein.",
      });
    }
  }));

export type OfferContent = z.infer<typeof offerSchema>;
export interface Offer extends OfferContent {
  slug: string;
}
export type PricingOption = z.infer<typeof pricingOptionSchema>;

export const eventSchema = z.preprocess((value) => {
  if (!value || typeof value !== "object") return value;
  const source = value as Record<string, unknown>;
  const legacyStatus = source.status;
  return {
    ...source,
    category: source.category ?? source.kategorie,
    state:
      source.state ??
      (legacyStatus === "cancelled" ? "cancelled" : "scheduled"),
  };
}, z
  .object({
    title: requiredString(),
    published,
    state: z.enum(["scheduled", "sold_out", "cancelled"]),
    date: dateString,
    endDate: optionalDateString,
    startTime: optionalTime,
    endTime: optionalTime,
    location: requiredString(),
    category: z.enum(["seminar", "workshop"]),
    relatedOffer: optionalString,
    instructorName: optionalString,
    instructorOrganization: optionalString,
    instructorUrl: optionalHttpsUrl,
    description: requiredString(),
    body: requiredString(),
    imageSrc: imagePath,
    imageAlt: requiredString("Bitte beschreiben Sie, was auf dem Bild zu sehen ist."),
    highlights: stringList(1, 8),
    capacity: optionalString,
    priceDisplay: optionalString,
    registrationLabel: optionalString,
    sortOrder,
    seo: seoSchema,
  })
  .superRefine((event, context) => {
    if ((event.instructorOrganization || event.instructorUrl) && !event.instructorName) {
      context.addIssue({
        code: "custom",
        path: ["instructorName"],
        message: "Bitte tragen Sie zur Organisation oder Website auch den Namen der Kursleitung ein.",
      });
    }
    if (event.endDate && event.endDate < event.date) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Das Enddatum darf nicht vor dem Startdatum liegen.",
      });
    }
    if (
      event.startTime &&
      event.endTime &&
      (!event.endDate || event.endDate === event.date) &&
      event.endTime < event.startTime
    ) {
      context.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "Die Endzeit darf bei eintägigen Veranstaltungen nicht vor der Startzeit liegen.",
      });
    }
  }));

export type EventContent = z.infer<typeof eventSchema>;
export interface Event extends EventContent {
  slug: string;
  chronology: "upcoming" | "past";
  /** @deprecated Use category. */
  kategorie: EventContent["category"];
  /** @deprecated Use state and chronology. */
  status: "upcoming" | "past" | "cancelled";
  /** @deprecated Homepage selection is relation-driven. */
  featured?: boolean;
}

export const teamMemberSchema = z.object({
  name: requiredString(),
  published,
  role: requiredString(),
  shortBio: requiredString().max(220),
  body: optionalString,
  imageSrc: imagePath,
  imageAlt: requiredString(),
  qualifications: stringList(0, 8).default([]),
  sortOrder,
});

export type TeamMemberContent = z.infer<typeof teamMemberSchema>;
export interface TeamMember extends TeamMemberContent {
  slug: string;
}

export const horseSchema = z.preprocess((value) => {
  if (!value || typeof value !== "object") return value;
  const source = value as Record<string, unknown>;
  return {
    ...source,
    ageText: source.ageText ?? source.age,
    roles: source.roles ?? (source.role ? [source.role] : undefined),
  };
}, z
  .object({
    name: requiredString(),
    published,
    breed: requiredString(),
    birthYear: z.coerce.number().int().min(1900).max(2100).optional(),
    ageText: optionalString,
    character: requiredString(),
    roles: stringList(1, 6),
    imageSrc: imagePath,
    imageAlt: requiredString(),
    sortOrder,
  })
  .superRefine((horse, context) => {
    if (!horse.birthYear && !horse.ageText) {
      context.addIssue({
        code: "custom",
        path: ["birthYear"],
        message: "Bitte geben Sie das Geburtsjahr oder eine Altersangabe ein.",
      });
    }
  }));

export type HorseContent = z.infer<typeof horseSchema>;
export interface Horse extends HorseContent {
  slug: string;
  age?: string;
  role: string;
}

export const galleryImageSchema = z.preprocess((value) => {
  if (!value || typeof value !== "object") return value;
  const source = value as Record<string, unknown>;
  return {
    ...source,
    category: source.category === "unterricht" ? "workshops" : source.category,
  };
}, z.object({
  title: requiredString(),
  published,
  src: imagePath,
  alt: requiredString("Bitte beschreiben Sie, was auf dem Bild zu sehen ist."),
  caption: optionalString,
  category: z.enum(["hof", "pferde", "coaching", "workshops", "events"]),
  relatedHorse: optionalString,
  relatedEvent: optionalString,
  sortOrder,
}));

export type GalleryImageContent = z.infer<typeof galleryImageSchema>;
export interface GalleryImage extends GalleryImageContent {
  slug: string;
  width: number;
  height: number;
}

export const announcementSchema = z
  .object({
    title: requiredString(),
    enabled: z.boolean().default(false),
    message: requiredString().max(220),
    variant: z.enum(["info", "success", "warning"]),
    startDate: optionalDateString,
    endDate: optionalDateString,
    linkLabel: optionalString,
    linkHref: internalOrExternalLink.optional(),
    sortOrder,
  })
  .superRefine((announcement, context) => {
    if (announcement.endDate && announcement.startDate && announcement.endDate < announcement.startDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Das Enddatum darf nicht vor dem Startdatum liegen.",
      });
    }
    if (Boolean(announcement.linkLabel) !== Boolean(announcement.linkHref)) {
      context.addIssue({
        code: "custom",
        path: announcement.linkLabel ? ["linkHref"] : ["linkLabel"],
        message: "Linktext und Linkziel müssen gemeinsam ausgefüllt oder leer sein.",
      });
    }
  });

export type AnnouncementContent = z.infer<typeof announcementSchema>;
export interface Announcement extends AnnouncementContent {
  slug: string;
}

export const legalSettingsSchema = z.object({
  legalName: requiredString(),
  legalForm: optionalString,
  registerCourt: optionalString,
  registerNumber: optionalString,
  taxNumber: optionalString,
  managingPersons: stringList(1, 8),
  contentResponsibleName: requiredString(),
  contentResponsibleAddress: requiredString(),
});

export type LegalSettings = z.infer<typeof legalSettingsSchema>;

export const legalPageSchema = z.object({
  title: requiredString(),
  lastReviewedAt: optionalDateString,
  reviewedBy: optionalString,
  body: requiredString(),
});

export type LegalPageContent = z.infer<typeof legalPageSchema>;

export interface Price {
  slug: string;
  title: string;
  price: string;
  unit: string;
  features: string[];
  highlighted?: boolean;
  published: boolean;
  sortOrder?: number;
}
