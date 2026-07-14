import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import MultiStepForm from "@/components/ui/MultiStepForm";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import Map from "@/components/common/Map";
import { getContactPageContent, getSiteSettings } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const page = getContactPageContent();
  return buildPageMetadata(page.seo, {
    title: page.title,
    description: page.intro,
  });
}

export default function Kontakt() {
  const page = getContactPageContent();
  const site = getSiteSettings();

  return (
    <>
      <section className="bg-beige pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
              {page.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              {page.title}
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl">{page.intro}</p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <ScrollReveal>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                  {page.formEyebrow}
                </p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-8">
                  {page.formTitle}
                </h2>
                <MultiStepForm variant="inline" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                  {page.contactEyebrow}
                </p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-8">
                  {page.contactTitle}
                </h2>

                <div className="space-y-5 mb-8">
                  <ContactRow icon={<MapPin className="w-5 h-5 text-forest" />} label="Adresse">
                    <span>{site.address}</span>
                  </ContactRow>
                  {site.phone ? (
                    <ContactRow icon={<Phone className="w-5 h-5 text-forest" />} label="Telefon">
                      <a href={`tel:${site.phone}`} className="hover:text-forest">
                        {site.phone}
                      </a>
                    </ContactRow>
                  ) : null}
                  {site.email ? (
                    <ContactRow icon={<Mail className="w-5 h-5 text-forest" />} label="E-Mail">
                      <a href={`mailto:${site.email}`} className="hover:text-forest">
                        {site.email}
                      </a>
                    </ContactRow>
                  ) : null}
                </div>

                {page.availabilityNote ? (
                  <p className="mb-8 rounded-xl bg-beige px-5 py-4 text-text-secondary">
                    {page.availabilityNote}
                  </p>
                ) : null}

                <Map
                  className="mt-6"
                  embedUrl={site.mapEmbedUrl}
                  title={`Standort ${site.businessName}`}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-semibold mb-0.5">{label}</p>
        <div className="text-text-secondary">{children}</div>
      </div>
    </div>
  );
}
