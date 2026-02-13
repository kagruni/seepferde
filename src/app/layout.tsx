import type { Metadata } from "next";
import { Lora, Source_Sans_3 } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const lora = Lora({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Reiterhof Mandy Kolatka — Reitunterricht & Ponyreiten in Zwenkau",
    template: "%s — Reiterhof Mandy Kolatka",
  },
  description:
    "Familiärer Reiterhof mit Reitunterricht und Ponyreiten in Zwenkau bei Leipzig. Schnupperstunden, Einzelunterricht und Gruppenunterricht für Anfänger und Fortgeschrittene.",
  metadataBase: new URL("https://mandykolatka.kajik.dev"),
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Reiterhof Mandy Kolatka",
    images: [
      {
        url: "/images/hero/hero-main.jpeg",
        width: 1200,
        height: 800,
        alt: "Reiterhof Mandy Kolatka — Reitplatz mit Pferden am Zwenkauer See",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Reiterhof Mandy Kolatka",
              description:
                "Familiärer Reiterhof mit Reitunterricht und Ponyreiten in Zwenkau bei Leipzig",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Hafenstraße 20",
                addressLocality: "Zwenkau",
                postalCode: "04442",
                addressCountry: "DE",
              },
              url: "https://mandykolatka.kajik.dev",
            }),
          }}
        />
      </head>
      <body className={`${lora.variable} ${sourceSans.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
