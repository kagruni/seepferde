export interface NavLink {
  label: string;
  href: string;
}

export interface Horse {
  name: string;
  breed: string;
  age?: string;
  character: string;
  role: string;
  imageSrc: string;
  imageAlt: string;
}

export interface Price {
  title: string;
  price: string;
  unit: string;
  features: string[];
  highlighted?: boolean;
}

export interface GalleryImage {
  src: string;
  alt: string;
  category: "hof" | "pferde" | "unterricht" | "events";
  width: number;
  height: number;
}

export interface Event {
  title: string;
  slug: string;
  date: string;
  endDate?: string;
  location: string;
  description: string;
  longDescription: string;
  imageSrc: string;
  imageAlt: string;
  kategorie: "seminar" | "workshop";
  highlights: string[];
  status: "upcoming" | "past" | "cancelled";
  featured?: boolean;
}

export interface Angebot {
  title: string;
  slug: string;
  description: string;
  kategorie: "seminar" | "workshop";
  icon: string;
  themen?: string[];
  teilnehmer?: string[];
  format?: string;
  besonderheit?: string;
  voraussetzungen?: string;
  teilnehmerzahl?: string;
  extras?: string;
}
