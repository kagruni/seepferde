import type { NavLink, Horse, Price, GalleryImage } from "@/types";

export const CONTACT = {
  address: "Hafenstraße 20, 04442 Zwenkau",
  phone: "[wird ergänzt]",
  email: "[wird ergänzt]",
  hours: "[wird ergänzt]",
};

export const NAV_LINKS: NavLink[] = [
  { label: "Startseite", href: "/" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Angebote", href: "/angebote" },
  { label: "Pferde", href: "/pferde" },
  { label: "Preise", href: "/preise" },
  { label: "Galerie", href: "/galerie" },
  { label: "Kontakt", href: "/kontakt" },
];

export const HORSES: Horse[] = [
  {
    name: "Luna",
    breed: "Deutsches Warmblut",
    age: "12 Jahre",
    character:
      "Ruhig, geduldig und besonders kinderlieb. Luna ist unsere zuverlässigste Schulstute und ideal für Anfänger.",
    role: "Anfängerunterricht, Longenstunden",
    imageSrc: "/images/horses/warmblut-fuchs.jpeg",
    imageAlt: "Luna — Deutsches Warmblut, Fuchs mit weißem Stern",
  },
  {
    name: "Shadow",
    breed: "Deutsches Warmblut",
    age: "9 Jahre",
    character:
      "Elegant und temperamentvoll, aber gut ausgebildet. Shadow fordert fortgeschrittene Reiter und belohnt feines Reiten.",
    role: "Fortgeschrittenenunterricht, Dressur",
    imageSrc: "/images/horses/warmblut-rappe.jpeg",
    imageAlt: "Shadow — Deutsches Warmblut, Rappe mit edlem Profil",
  },
];

export const PRICES: Price[] = [
  {
    title: "Schnupperstunde",
    price: "[Preis]",
    unit: "einmalig",
    features: [
      "60 Minuten",
      "Kennenlernen der Pferde",
      "Erste Reitversuche an der Longe",
      "Persönliche Beratung",
    ],
    highlighted: true,
  },
  {
    title: "Einzelunterricht",
    price: "[Preis]",
    unit: "pro Stunde",
    features: [
      "45 Minuten Reitzeit",
      "Individuelle Betreuung",
      "Alle Leistungsstufen",
      "Flexibel buchbar",
    ],
  },
  {
    title: "Gruppenunterricht",
    price: "[Preis]",
    unit: "pro Stunde",
    features: [
      "45 Minuten Reitzeit",
      "Max. 4 Teilnehmer",
      "Anfänger & Fortgeschrittene",
      "Wöchentlich",
    ],
  },
  {
    title: "Ponyreiten",
    price: "[Preis]",
    unit: "pro 30 Min.",
    features: [
      "Geführtes Reiten",
      "Für Kinder ab 3 Jahren",
      "Sichere Schulponys",
      "Mit Begleitperson",
    ],
  },
  {
    title: "5er-Karte",
    price: "[Preis]",
    unit: "5 Stunden",
    features: [
      "5 × Gruppenunterricht",
      "6 Monate gültig",
      "Ersparnis gegenüber Einzelbuchung",
      "Übertragbar",
    ],
  },
  {
    title: "10er-Karte",
    price: "[Preis]",
    unit: "10 Stunden",
    features: [
      "10 × Gruppenunterricht",
      "12 Monate gültig",
      "Beste Ersparnis",
      "Übertragbar",
    ],
    highlighted: true,
  },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: "/images/hero/hero-main.jpeg",
    alt: "Reiterhof Mandy Kolatka — Panorama mit Reitplatz und Zwenkauer See",
    category: "hof",
    width: 1200,
    height: 800,
  },
  {
    src: "/images/hero/hero-rider.jpeg",
    alt: "Reiterin auf Fuchs im Schritt am Reitplatz",
    category: "unterricht",
    width: 1200,
    height: 800,
  },
  {
    src: "/images/angebote/ponyreiten-1.jpeg",
    alt: "Kind auf Shetland-Pony, geführt durch Reitlehrerin",
    category: "unterricht",
    width: 1200,
    height: 800,
  },
  {
    src: "/images/angebote/reitunterricht-anfaenger.jpeg",
    alt: "Anfängerin im Reitunterricht mit Reitlehrerin",
    category: "unterricht",
    width: 1200,
    height: 800,
  },
  {
    src: "/images/angebote/ponyreiten-2.jpeg",
    alt: "Kind auf Pony auf ländlichem Weg mit Wildblumen",
    category: "unterricht",
    width: 1200,
    height: 800,
  },
  {
    src: "/images/angebote/longenstunde.jpeg",
    alt: "Longenstunde — Reiterin auf Schimmel mit ausgestreckten Armen",
    category: "unterricht",
    width: 1200,
    height: 800,
  },
  {
    src: "/images/angebote/schnupperstunde.jpeg",
    alt: "Erste Begegnung — junge Frau streichelt Pferd am Stall",
    category: "unterricht",
    width: 1200,
    height: 800,
  },
  {
    src: "/images/horses/warmblut-fuchs.jpeg",
    alt: "Luna — Warmblut-Fuchs im goldenen Licht",
    category: "pferde",
    width: 1200,
    height: 800,
  },
  {
    src: "/images/horses/warmblut-rappe.jpeg",
    alt: "Shadow — Warmblut-Rappe im warmen Gegenlicht",
    category: "pferde",
    width: 1200,
    height: 800,
  },
  {
    src: "/images/kontakt/eingang.jpeg",
    alt: "Eingang zum Reiterhof mit Pferd am Zaun",
    category: "hof",
    width: 1200,
    height: 800,
  },
];
