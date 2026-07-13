import type { Metadata } from "next";
import MultiStepForm from "@/components/ui/MultiStepForm";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import Map from "@/components/common/Map";
import { getSiteSettings } from "@/lib/content";
import { MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt & Anfahrt",
  description: "Kontaktieren Sie See-Pferde Zwenkau — Kontaktformular und Anfahrt.",
};

export default function Kontakt() {
  const siteSettings = getSiteSettings();

  return (
    <>
      {/* Hero */}
      <section className="bg-beige pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
              See-Pferde Zwenkau
            </p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              Kontakt & Anfahrt
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              Wir freuen uns auf Ihre Nachricht — kontaktieren Sie uns gerne per Formular, Telefon oder E-Mail.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Main Content */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Form */}
            <ScrollReveal>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Schreiben Sie uns</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-8">Kontaktformular</h2>
                <MultiStepForm variant="inline" />
              </div>
            </ScrollReveal>

            {/* Right: Info + Map */}
            <ScrollReveal delay={200}>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">So erreichen Sie uns</p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-8">Kontaktdaten</h2>

                <div className="space-y-5 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-forest" />
                    </div>
                    <div>
                      <p className="font-semibold mb-0.5">Adresse</p>
                      <p className="text-text-secondary">{siteSettings.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-forest" />
                    </div>
                    <div>
                      <p className="font-semibold mb-0.5">Telefon</p>
                      <p className="text-text-secondary">{siteSettings.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-forest" />
                    </div>
                    <div>
                      <p className="font-semibold mb-0.5">E-Mail</p>
                      <p className="text-text-secondary">{siteSettings.email}</p>
                    </div>
                  </div>
                </div>

                <Map className="mt-6" embedUrl={siteSettings.mapEmbedUrl} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
