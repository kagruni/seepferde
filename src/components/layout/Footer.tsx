import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { NAV_LINKS, CONTACT } from "@/lib/constants";

export default function Footer() {
  return (
    <footer>
      {/* Botanical divider above footer */}
      <div
        className="bg-cream w-full h-12 md:h-16 opacity-40"
        style={{
          backgroundImage: "url(/images/decorative/divider-botanical.svg)",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "center",
          backgroundSize: "auto 100%",
        }}
        aria-hidden="true"
      />

      <div className="bg-[#3D2E1F] text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <Image
              src="/icons/logo.svg"
              alt="Reiterhof Mandy Kolatka"
              width={200}
              height={56}
              className="h-14 w-auto brightness-0 invert opacity-80"
            />
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {/* Column 1: Contact */}
            <div>
              <h4 className="text-lg font-heading font-semibold text-gold-light mb-4">
                Kontakt
              </h4>
              <ul className="space-y-3 text-cream/80">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-gold/60 shrink-0" />
                  <span>{CONTACT.address}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-0.5 text-gold/60 shrink-0" />
                  <span>{CONTACT.phone}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-0.5 text-gold/60 shrink-0" />
                  <span>{CONTACT.email}</span>
                </li>
              </ul>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h4 className="text-lg font-heading font-semibold text-gold-light mb-4">
                Navigation
              </h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-cream/80 hover:text-gold-light transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/impressum"
                    className="text-cream/80 hover:text-gold-light transition-colors duration-200"
                  >
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link
                    href="/datenschutz"
                    className="text-cream/80 hover:text-gold-light transition-colors duration-200"
                  >
                    Datenschutz
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Opening Hours */}
            <div>
              <h4 className="text-lg font-heading font-semibold text-gold-light mb-4">
                Öffnungszeiten
              </h4>
              <ul className="space-y-3 text-cream/80">
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 mt-0.5 text-gold/60 shrink-0" />
                  <span>{CONTACT.hours}</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-cream/50">
                Termine nach Vereinbarung. Bitte kontaktieren Sie uns
                telefonisch oder per E-Mail.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-cream/10 py-6">
          <p className="text-center text-sm text-cream/40">
            &copy; {new Date().getFullYear()} Reiterhof Mandy Kolatka. Alle
            Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
