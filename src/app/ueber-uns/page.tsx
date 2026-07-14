import Image from "next/image";
import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import MarkdownContent from "@/components/common/MarkdownContent";
import { getAboutPageContent, getTeamMembers } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const page = getAboutPageContent();
  return buildPageMetadata(page.seo, {
    title: page.title,
    description: page.intro,
    image: page.philosophyImage,
    imageAlt: page.philosophyImageAlt,
  });
}

export default function UeberUns() {
  const page = getAboutPageContent();
  const team = getTeamMembers();

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

      <section className="relative bg-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "url(/images/textures/paper-warm.jpeg)",
            backgroundSize: "cover",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal>
              <div>
                <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                  {page.philosophyEyebrow}
                </p>
                <h2 className="text-3xl sm:text-4xl leading-tight mb-6">
                  {page.philosophyTitle}
                </h2>
                <MarkdownContent className="text-text-secondary text-lg">
                  {page.philosophyBody}
                </MarkdownContent>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="relative flex justify-center">
                <Image
                  src={page.philosophyImage}
                  alt={page.philosophyImageAlt}
                  width={450}
                  height={450}
                  className="w-full max-w-sm opacity-75"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-beige py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
                {page.teamEyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl">{page.teamTitle}</h2>
              {page.teamIntro ? (
                <p className="mt-4 mx-auto max-w-2xl text-text-secondary text-lg">
                  {page.teamIntro}
                </p>
              ) : null}
            </div>
          </ScrollReveal>

          {team.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {team.map((member, index) => (
                <ScrollReveal key={member.slug} delay={index * 100} className="h-full">
                  <article className="h-full bg-white rounded-2xl shadow-sm border border-brown/12 p-8 text-center">
                    <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden relative">
                      <Image
                        src={member.imageSrc}
                        alt={member.imageAlt}
                        fill
                        className="object-cover object-top"
                        sizes="128px"
                      />
                    </div>
                    <h3 className="text-2xl mb-1">{member.name}</h3>
                    <p className="text-gold font-semibold text-sm tracking-wide uppercase mb-4">
                      {member.role}
                    </p>
                    <p className="text-text-secondary leading-relaxed">
                      {member.shortBio}
                    </p>
                    {member.qualifications?.length ? (
                      <ul className="mt-5 space-y-2 text-left text-sm text-text-secondary">
                        {member.qualifications.map((qualification) => (
                          <li key={qualification} className="flex gap-2">
                            <span aria-hidden="true" className="text-gold">•</span>
                            {qualification}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {member.body ? (
                      <MarkdownContent className="mt-5 text-left text-text-secondary">
                        {member.body}
                      </MarkdownContent>
                    ) : null}
                  </article>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-text-secondary">
              Das Team wird in Kürze vorgestellt.
            </p>
          )}

          <ScrollReveal delay={200}>
            <div className="text-center mt-12">
              <Button href="/kontakt" variant="primary">
                {page.ctaLabel}
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
