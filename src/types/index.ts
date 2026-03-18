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

export interface SiteSettings {
  businessName: string;
  legalName: string;
  siteUrl: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  mailtoEmail: string;
  hours: string;
  footerNote: string;
  mapEmbedUrl: string;
  heroImage: string;
  heroWatercolorImage: string;
  ogImage: string;
  navLinks: NavLink[];
  contactSubjects: string[];
}

export interface HomePageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCtaLabel: string;
  heroSecondaryCtaLabel: string;
  welcomeEyebrow: string;
  welcomeTitle: string;
  welcomeParagraphs: string[];
  offersEyebrow: string;
  offersTitle: string;
  eventsEyebrow: string;
  eventsTitle: string;
  contactEyebrow: string;
  contactTitle: string;
  contactText: string;
  contactCtaLabel: string;
}

export interface Horse {
  slug: string;
  name: string;
  breed: string;
  age?: string;
  character: string;
  role: string;
  imageSrc: string;
  imageAlt: string;
  published: boolean;
  sortOrder?: number;
}

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

export interface GalleryImage {
  title: string;
  src: string;
  alt: string;
  category: "hof" | "pferde" | "unterricht" | "events";
  width: number;
  height: number;
  published: boolean;
  sortOrder?: number;
}

export interface Event {
  title: string;
  slug: string;
  date: string;
  endDate?: string;
  location: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  kategorie: "seminar" | "workshop";
  highlights: string[];
  body: string;
  status: "draft" | "upcoming" | "past" | "cancelled";
  featured?: boolean;
  published: boolean;
  sortOrder?: number;
}

export interface Angebot {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: "seminar" | "workshop";
  imageSrc: string;
  imageAlt: string;
  highlights: string[];
  audience?: string[];
  body: string;
  format?: string;
  specialNote?: string;
  prerequisites?: string;
  participantCount?: string;
  published: boolean;
  featured?: boolean;
  sortOrder?: number;
}

export interface Announcement {
  title: string;
  slug: string;
  message: string;
  enabled: boolean;
  variant: "info" | "success" | "warning";
  startDate?: string;
  endDate?: string;
  linkLabel?: string;
  linkHref?: string;
  sortOrder?: number;
}
