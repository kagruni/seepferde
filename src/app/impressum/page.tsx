import type { Metadata } from "next";
import type { ReactNode } from "react";
import MarkdownContent from "@/components/common/MarkdownContent";
import { getImprintContent, getLegalSettings, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung von See-Pferde Zwenkau.",
};

export default function Impressum() {
  const page = getImprintContent();
  const legal = getLegalSettings();
  const site = getSiteSettings();

  return (
    <section className="bg-white pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-heading font-bold mb-10">{page.title}</h1>

        <div className="space-y-8 text-text-secondary">
          <LegalSection title="Angaben zum Anbieter">
            <p>
              {legal.legalName}
              {legal.legalForm && !legal.legalName.includes(legal.legalForm)
                ? ` ${legal.legalForm}`
                : ""}
              <br />
              {site.address}
            </p>
          </LegalSection>

          {legal.registerCourt || legal.registerNumber ? (
            <LegalSection title="Handelsregister">
              <p>
                {legal.registerCourt}
                {legal.registerCourt && legal.registerNumber ? <br /> : null}
                {legal.registerNumber}
              </p>
            </LegalSection>
          ) : null}

          {legal.taxNumber ? (
            <LegalSection title="Steuernummer">
              <p>{legal.taxNumber}</p>
            </LegalSection>
          ) : null}

          <LegalSection title="Geschäftsführung">
            <p>{legal.managingPersons.join(" & ")}</p>
          </LegalSection>

          {site.phone || site.email ? (
            <LegalSection title="Kontakt">
              <p>
                {site.phone ? (
                  <>
                    Telefon: <a href={`tel:${site.phone}`}>{site.phone}</a>
                    <br />
                  </>
                ) : null}
                {site.email ? (
                  <>
                    E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
                  </>
                ) : null}
              </p>
            </LegalSection>
          ) : null}

          <LegalSection title="Verantwortlich für den Inhalt">
            <p className="whitespace-pre-line">
              {legal.contentResponsibleName}
              {"\n"}
              {legal.contentResponsibleAddress}
            </p>
          </LegalSection>

          <MarkdownContent>{page.body}</MarkdownContent>

          {page.lastReviewedAt || page.reviewedBy ? (
            <p className="border-t border-brown/10 pt-5 text-sm text-text-light">
              Fachlich geprüft
              {page.lastReviewedAt ? ` am ${page.lastReviewedAt}` : ""}
              {page.reviewedBy ? ` von ${page.reviewedBy}` : ""}.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-heading font-semibold text-text mb-2">{title}</h2>
      {children}
    </section>
  );
}
