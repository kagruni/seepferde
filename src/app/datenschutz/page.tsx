import type { Metadata } from "next";
import MarkdownContent from "@/components/common/MarkdownContent";
import { getLegalSettings, getPrivacyContent, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Informationen zum Umgang mit personenbezogenen Daten bei See-Pferde Zwenkau.",
};

export default function Datenschutz() {
  const page = getPrivacyContent();
  const legal = getLegalSettings();
  const site = getSiteSettings();

  return (
    <section className="bg-white pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-heading font-bold mb-10">{page.title}</h1>

        <div className="text-text-secondary">
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-text mb-4">
              1. Verantwortlicher
            </h2>
            <p>
              {legal.legalName}<br />
              {site.address}<br />
              Geschäftsführung: {legal.managingPersons.join(" & ")}
              {site.email ? (
                <><br />E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a></>
              ) : null}
              {site.phone ? (
                <><br />Telefon: <a href={`tel:${site.phone}`}>{site.phone}</a></>
              ) : null}
            </p>
          </section>

          <MarkdownContent>{page.body}</MarkdownContent>

          {page.lastReviewedAt || page.reviewedBy ? (
            <p className="mt-10 border-t border-brown/10 pt-5 text-sm text-text-light">
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
