import type { Offer } from "@/lib/content/schemas";

export type {
  AccommodationPageContent,
  AboutPageContent,
  Announcement,
  ContactPageContent,
  Event,
  EventContent,
  EventsPageContent,
  GalleryImage,
  GalleryImageContent,
  GalleryPageContent,
  HomePageContent,
  Horse,
  HorseContent,
  HorsesPageContent,
  LegalPageContent,
  LegalSettings,
  Offer,
  OfferContent,
  OffersPageContent,
  Price,
  PricesPageContent,
  PricingOption,
  SeoSettings,
  SiteSettings,
  TeamMember,
  TeamMemberContent,
} from "@/lib/content/schemas";

/** @deprecated Use Offer. Kept while existing components migrate. */
export type Angebot = Offer;

export interface NavLink {
  label: string;
  href: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  mailtoEmail: string;
  hours: string;
}
