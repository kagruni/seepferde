export interface NavigationLink {
  href: string;
  label: string;
}

// Route structure is code-owned so an editor cannot accidentally create a
// broken or unreachable navigation item in Decap CMS.
export const primaryNavigation: NavigationLink[] = [
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/angebote", label: "Angebote" },
  { href: "/veranstaltungen", label: "Veranstaltungen" },
  { href: "/pferde", label: "Pferde" },
  { href: "/preise", label: "Preise" },
  { href: "/galerie", label: "Galerie" },
];

export const footerNavigation: NavigationLink[] = [
  ...primaryNavigation,
  { href: "/pferdeunterbringung", label: "Pferdeunterbringung" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
];
