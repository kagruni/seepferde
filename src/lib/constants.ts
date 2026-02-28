import type { NavLink, Horse, Price, GalleryImage, Angebot, Event } from "@/types";

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
  { label: "Veranstaltungen", href: "/veranstaltungen" },
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

export const ANGEBOTE: Angebot[] = [
  {
    title: "Coaching für Führungskräfte",
    slug: "fuehrungskraefte-coaching",
    description:
      "Pferdegestütztes Leadership-Coaching — Pferde als Spiegel für Führungsverhalten.",
    kategorie: "seminar",
    icon: "Crown",
    themen: [
      "Führungsstile erkennen",
      "Authentizität stärken",
      "Durchsetzungsfähigkeit",
      "Veränderungsprozesse begleiten",
      "Eigene Rolle einordnen",
      "Stärken und Schwächen erkennen",
    ],
    teilnehmer: [
      "Unternehmer",
      "Manager",
      "Abteilungs-, Team- und Projektleiter",
      "Personalverantwortliche",
      "Nachwuchskräfte mit Führungsaufgaben",
    ],
    format: "Einzel- und Gruppencoaching, auch für Unternehmen",
    besonderheit:
      "Keine Reiterfahrung nötig — Arbeit mit dem Pferd, nicht auf dem Pferd",
  },
  {
    title: "Teambuilding",
    slug: "teambuilding",
    description:
      "Pferdegestütztes Teambuilding — das Pferd als neues Teammitglied, Teamdynamik erkennen und stärken.",
    kategorie: "seminar",
    icon: "Users",
    themen: [
      "Kommunikation im Team",
      "Motivation",
      "Veränderungsprozesse",
      "Teamgefühl stärken",
      "Aufgabenverteilung",
      "Miteinander statt Gegeneinander",
      "Hierarchien erkennen",
    ],
    teilnehmer: [
      "Unternehmer",
      "Manager",
      "Abteilungs-, Team- und Projektleiter",
      "Personalverantwortliche",
      "Mitarbeiter",
      "Nachwuchskräfte",
    ],
    format: "Einzel- und Gruppencoaching, auch für Unternehmen",
    besonderheit: "Keine Reiterfahrung nötig",
  },
  {
    title: "Raus aus dem Alltag – rein ins Erleben!",
    slug: "erlebnistag",
    description:
      "Kreativer, erlebnisorientierter Tag — Teamgeist stärken durch gemeinsames Erleben.",
    kategorie: "seminar",
    icon: "Sun",
    teilnehmer: ["Firmen", "Vereine", "Familien", "Freundeskreise"],
    extras:
      "Volle Verpflegung und Organisation möglich (Catering, Lagerfeuer, Fotograf)",
    besonderheit: "Keine Reiterfahrung nötig",
  },
  {
    title: "Extreme-Trail",
    slug: "extreme-trail",
    description:
      "Erster Extreme-Trail Park in Sachsen! Vertrauen aufbauen und Eigenständigkeit fördern — für Mensch und Pferd. Hindernisse aus natürlichen Materialien.",
    kategorie: "workshop",
    icon: "Mountain",
    teilnehmer: [
      "Alle Rassen",
      "Alle Reitweisen",
      "Anfänger bis Fortgeschrittene",
    ],
    teilnehmerzahl: "4–8 aktive Teilnehmer + 10 Zuschauerplätze",
    besonderheit:
      "Teilnahme mit eigenem Pferd oder mit einem Pferd vom Hof möglich",
  },
  {
    title: "Working-Equitation",
    slug: "working-equitation",
    description:
      "Motivations-Parcours für Pferd und Reiter — dressurmäßige Arbeit verbunden mit konkreten Trail-Aufgaben.",
    kategorie: "workshop",
    icon: "Target",
    teilnehmer: [
      "Einsteiger bis Fortgeschrittene",
      "Pferde aller Rassen",
    ],
    teilnehmerzahl: "4–6 aktive Teilnehmer + 10 Zuschauer",
  },
  {
    title: "Garrocha",
    slug: "garrocha",
    description:
      "Einstieg in das Reiten mit der Garrocha — traditionelle südeuropäische Reitkunst als Motivation und Freude.",
    kategorie: "workshop",
    icon: "Swords",
    voraussetzungen:
      "Sicheres Reiten im Schritt und Trab, enge Volten (~6 m), Vorhand/Hinterhand verschieben, Grundlagen einhändiges Reiten",
  },
];

export const EVENTS: Event[] = [
  {
    title: "Extreme-Trail Workshop — Frühlingskurs",
    slug: "extreme-trail-fruehling-2026",
    date: "2026-04-12",
    endDate: "2026-04-12",
    location: "Reiterhof Mandy Kolatka, Zwenkau",
    description:
      "Erleben Sie unseren Extreme-Trail Park im Frühling! Ein Tag voller Vertrauen, Kommunikation und Hindernisse aus natürlichen Materialien — für Mensch und Pferd.",
    longDescription:
      "Unser Frühjahrs-Workshop im ersten Extreme-Trail Park Sachsens bietet Ihnen die Möglichkeit, gemeinsam mit Ihrem Pferd natürliche Hindernisse zu meistern. Der Tag beginnt mit einer Einführung in die Grundlagen der Bodenarbeit und führt Sie Schritt für Schritt durch unseren abwechslungsreichen Parcours. Dabei stehen Vertrauen, Kommunikation und die Förderung der Eigenständigkeit Ihres Pferdes im Mittelpunkt. Ob Anfänger oder Fortgeschrittener — der Workshop ist für alle Reitweisen und Rassen geeignet. Teilnahme mit eigenem Pferd oder einem unserer Hofpferde möglich.",
    imageSrc: "/images/hero/hero-main.jpeg",
    imageAlt: "Extreme-Trail Workshop — Pferd und Reiter am Hindernis",
    kategorie: "workshop",
    highlights: [
      "Erster Extreme-Trail Park in Sachsen",
      "Für Anfänger und Fortgeschrittene",
      "Alle Rassen und Reitweisen willkommen",
      "Eigenes Pferd oder Hofpferd möglich",
      "4–8 aktive Teilnehmer",
      "Individuelle Betreuung",
    ],
    status: "upcoming",
    featured: true,
  },
  {
    title: "Working-Equitation Tageskurs",
    slug: "working-equitation-herbst-2025",
    date: "2025-09-20",
    location: "Reiterhof Mandy Kolatka, Zwenkau",
    description:
      "Ein intensiver Tageskurs rund um Working-Equitation — dressurmäßige Arbeit verbunden mit konkreten Trail-Aufgaben für Pferd und Reiter.",
    longDescription:
      "Unser Working-Equitation Tageskurs verbindet dressurmäßige Arbeit mit praxisnahen Trail-Aufgaben. Sie lernen, Ihr Pferd fein und präzise durch einen abwechslungsreichen Parcours zu führen. Der Kurs richtet sich an Einsteiger und Fortgeschrittene gleichermaßen. In kleinen Gruppen von 4–6 Teilnehmern erhalten Sie intensive Betreuung und individuelles Feedback. Ein Tag voller Motivation und Freude am gemeinsamen Reiten.",
    imageSrc: "/images/hero/hero-main.jpeg",
    imageAlt: "Working-Equitation Kurs — Reiter im Parcours",
    kategorie: "workshop",
    highlights: [
      "Dressur trifft Trail-Parcours",
      "Kleine Gruppen (4–6 Teilnehmer)",
      "Für Einsteiger und Fortgeschrittene",
      "Pferde aller Rassen",
      "Individuelles Feedback",
    ],
    status: "past",
  },
  {
    title: "Garrocha Einführungskurs",
    slug: "garrocha-sommer-2025",
    date: "2025-06-14",
    location: "Reiterhof Mandy Kolatka, Zwenkau",
    description:
      "Einstieg in das Reiten mit der Garrocha — traditionelle südeuropäische Reitkunst als Motivation und Freude für Reiter und Pferd.",
    longDescription:
      "In diesem Einführungskurs lernen Sie die Grundlagen des Reitens mit der Garrocha kennen — einer traditionellen südeuropäischen Reitdisziplin, die Eleganz, Präzision und Freude vereint. Unter erfahrener Anleitung üben Sie den Umgang mit der Garrocha-Stange zunächst vom Boden aus, bevor es in den Sattel geht. Voraussetzung ist sicheres Reiten im Schritt und Trab sowie Grundkenntnisse im einhändigen Reiten. Ein unvergessliches Erlebnis für alle, die Neues ausprobieren möchten.",
    imageSrc: "/images/hero/hero-main.jpeg",
    imageAlt: "Garrocha Kurs — Reiter mit Garrocha-Stange",
    kategorie: "workshop",
    highlights: [
      "Traditionelle südeuropäische Reitkunst",
      "Einführung vom Boden und im Sattel",
      "Erfahrene Anleitung",
      "Sicheres Reiten im Schritt/Trab vorausgesetzt",
      "Grundlagen einhändiges Reiten",
    ],
    status: "past",
  },
  {
    title: "Führungskräfte-Coaching Intensivtag",
    slug: "fuehrungskraefte-intensiv-2025",
    date: "2025-03-08",
    location: "Reiterhof Mandy Kolatka, Zwenkau",
    description:
      "Ein intensiver Coaching-Tag für Führungskräfte — pferdegestütztes Leadership-Training mit nachhaltiger Wirkung.",
    longDescription:
      "Unser Intensivtag für Führungskräfte verbindet pferdegestütztes Coaching mit praxisorientierten Leadership-Übungen. In kleiner Runde arbeiten Sie den ganzen Tag mit unseren Pferden und erleben hautnah, wie Ihre Führung wirkt. Die Pferde reagieren unmittelbar auf Ihre Körpersprache und innere Haltung — ehrlicher als jedes 360-Grad-Feedback. Keine Reiterfahrung nötig, die gesamte Arbeit findet am Boden statt.",
    imageSrc: "/images/hero/hero-main.jpeg",
    imageAlt: "Führungskräfte-Coaching mit Pferd auf dem Reiterhof",
    kategorie: "seminar",
    highlights: [
      "Pferdegestütztes Leadership-Coaching",
      "Kleine Gruppen für intensive Betreuung",
      "Keine Reiterfahrung nötig",
      "Nachhaltige Erkenntnisse",
      "Auch für Unternehmen buchbar",
    ],
    status: "past",
  },
];

export const PRICES: Price[] = [
  {
    title: "Führungskräfte-Coaching",
    price: "Preis auf Anfrage",
    unit: "pro Teilnehmer",
    features: [
      "Pferdegestütztes Leadership-Coaching",
      "Einzel- und Gruppencoaching",
      "Keine Reiterfahrung nötig",
      "Auch für Unternehmen",
    ],
  },
  {
    title: "Teambuilding",
    price: "Preis auf Anfrage",
    unit: "pro Teilnehmer",
    features: [
      "Pferdegestütztes Teambuilding",
      "Einzel- und Gruppencoaching",
      "Keine Reiterfahrung nötig",
      "Auch für Unternehmen",
    ],
  },
  {
    title: "Erlebnistag",
    price: "Preis auf Anfrage",
    unit: "pro Teilnehmer",
    features: [
      "Kreativer Erlebnistag",
      "Für Firmen, Vereine, Familien",
      "Catering & Organisation möglich",
      "Keine Reiterfahrung nötig",
    ],
  },
  {
    title: "Extreme-Trail",
    price: "Preis auf Anfrage",
    unit: "pro Teilnehmer",
    features: [
      "Erster Extreme-Trail Park in Sachsen",
      "4–8 aktive Teilnehmer",
      "Eigenes Pferd oder Hofpferd",
      "Alle Reitweisen willkommen",
    ],
  },
  {
    title: "Working-Equitation",
    price: "Preis auf Anfrage",
    unit: "pro Teilnehmer",
    features: [
      "Motivations-Parcours",
      "4–6 aktive Teilnehmer",
      "Einsteiger bis Fortgeschrittene",
      "Pferde aller Rassen",
    ],
  },
  {
    title: "Garrocha",
    price: "Preis auf Anfrage",
    unit: "pro Teilnehmer",
    features: [
      "Traditionelle südeuropäische Reitkunst",
      "Reiten mit der Garrocha-Stange",
      "Sicheres Reiten im Schritt/Trab vorausgesetzt",
      "Einhändiges Reiten",
    ],
  },
];

export const CONTACT_SUBJECTS = [
  "Führungskräfte-Coaching",
  "Teambuilding",
  "Erlebnistag / Team-Event",
  "Extreme-Trail",
  "Working-Equitation",
  "Garrocha",
  "Veranstaltungen",
  "Sonstiges",
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
