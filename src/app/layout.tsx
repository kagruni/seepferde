import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { SiteDataProvider } from "@/components/common/SiteDataProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/content";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const siteSettings = getSiteSettings();

export const metadata: Metadata = {
  title: {
    default: siteSettings.defaultTitle,
    template: siteSettings.titleTemplate,
  },
  description: siteSettings.defaultDescription,
  metadataBase: new URL(siteSettings.siteUrl),
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: siteSettings.businessName,
    images: [
      {
        url: siteSettings.ogImage,
        width: 1200,
        height: 800,
        alt: `${siteSettings.businessName} - Reitplatz mit Pferden am Zwenkauer See`,
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
              name: siteSettings.businessName,
              description: siteSettings.defaultDescription,
              address: {
                "@type": "PostalAddress",
                streetAddress: siteSettings.address.split(",")[0],
                addressLocality: siteSettings.city,
                postalCode: siteSettings.postalCode,
                addressCountry: siteSettings.country,
              },
              telephone: siteSettings.phone,
              email: siteSettings.email,
              url: siteSettings.siteUrl,
            }),
          }}
        />
      </head>
      <body className={`${playfair.variable} ${sourceSans.variable} antialiased`}>
        <SiteDataProvider value={siteSettings}>
          <Header />
          <main>{children}</main>
          <Footer siteSettings={siteSettings} />
        </SiteDataProvider>
      </body>
    </html>
  );
}
