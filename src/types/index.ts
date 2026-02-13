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
