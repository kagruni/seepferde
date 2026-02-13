import Image from "next/image";
import type { Metadata } from "next";
import ContactForm from "@/components/ui/ContactForm";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/common/ScrollReveal";
import Map from "@/components/common/Map";
import { CONTACT } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt & Anfahrt",
  description: "Kontaktieren Sie den Reiterhof Mandy Kolatka in Zwenkau — Kontaktformular, Anfahrt und Öffnungszeiten.",
};

export default function Kontakt() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-end">
        <Image src="/images/kontakt/eingang.jpeg" alt="Eingang zum Reiterhof Mandy Kolatka" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A3F28]/70 via-[#2A3F28]/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <ScrollReveal>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white drop-shadow-lg">Kontakt & Anfahrt</h1>
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
                <ContactForm />
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
                      <p className="text-text-secondary">{CONTACT.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-forest" />
                    </div>
                    <div>
                      <p className="font-semibold mb-0.5">Telefon</p>
                      <p className="text-text-secondary">{CONTACT.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-forest" />
                    </div>
                    <div>
                      <p className="font-semibold mb-0.5">E-Mail</p>
                      <p className="text-text-secondary">{CONTACT.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-forest" />
                    </div>
                    <div>
                      <p className="font-semibold mb-0.5">Öffnungszeiten</p>
                      <p className="text-text-secondary">{CONTACT.hours}</p>
                    </div>
                  </div>
                </div>

                <Map className="mt-6" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
