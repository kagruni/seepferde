import type { Metadata } from "next";
import { CircleCheck, Fence, House, Info, Trees } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";
import Button from "@/components/ui/Button";
import InquiryButton from "@/components/ui/InquiryButton";
import SectionDivider from "@/components/ui/SectionDivider";
import { getAccommodationPageContent } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

const optionIcons = [House, Fence, Trees];

export function generateMetadata(): Metadata {
  const page = getAccommodationPageContent();
  return buildPageMetadata(page.seo, {
    title: page.title,
    description: page.intro,
  });
}

export default function Pferdeunterbringung() {
  const page = getAccommodationPageContent();

  return (
    <>
      <section className="bg-beige pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
              {page.eyebrow}
            </p>
            <h1 className="mb-4 text-4xl font-heading font-bold sm:text-5xl">
              {page.title}
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-text-secondary">
              {page.intro}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {page.options.map((option, index) => {
              const Icon = optionIcons[index % optionIcons.length];
              return (
                <ScrollReveal key={option.title} delay={index * 100} className="h-full">
                  <article className="flex h-full flex-col rounded-2xl border border-brown/10 bg-cream p-6 shadow-sm">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10 text-forest">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold">{option.title}</h2>
                    <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-forest">
                      <CircleCheck className="h-4 w-4" aria-hidden="true" />
                      {option.availability}
                    </p>
                    <p className="mt-5 text-xl font-semibold text-text">{option.price}</p>
                    {option.note ? (
                      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                        {option.note}
                      </p>
                    ) : null}
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-beige py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="rounded-2xl border border-gold/25 bg-cream p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                  <Info className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold">{page.extrasTitle}</h2>
                  <p className="mt-3 leading-relaxed text-text-secondary">
                    {page.extrasBody}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[#3D2A35] py-16 text-white md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl text-white sm:text-4xl">{page.bookingTitle}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/80">
              {page.bookingBody}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <InquiryButton
                subject="Pferdeunterbringung"
                label={page.bookingCtaLabel}
                size="lg"
              />
              <Button
                href="/veranstaltungen"
                variant="secondary"
                size="lg"
                className="border-white/60 text-white hover:bg-white hover:text-text"
              >
                Kurse ansehen
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
