import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import type { SiteSettings } from "@/types";
import { footerNavigation } from "@/lib/navigation";

export default function Footer({ siteSettings }: { siteSettings: SiteSettings }) {
  return (
    <footer>
      <div className="bg-[#3D2A35] text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <Image
              src="/icons/logo.svg"
              alt="See-Pferde Zwenkau"
              width={200}
              height={56}
              className="h-14 w-auto brightness-0 invert opacity-80"
            />
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {/* Column 1: Contact */}
            <div>
              <h4 className="text-lg font-heading font-semibold text-brown-light mb-4">
                Kontakt
              </h4>
              <ul className="space-y-3 text-cream/80">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-brown/60 shrink-0" />
                  <span>{siteSettings.address}</span>
                </li>
                {siteSettings.phone ? (
                  <li className="flex items-start gap-3">
                    <Phone className="w-5 h-5 mt-0.5 text-brown/60 shrink-0" />
                    <a href={`tel:${siteSettings.phone}`} className="hover:text-brown-light">
                      {siteSettings.phone}
                    </a>
                  </li>
                ) : null}
                {siteSettings.email ? (
                  <li className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-0.5 text-brown/60 shrink-0" />
                    <a href={`mailto:${siteSettings.email}`} className="hover:text-brown-light">
                      {siteSettings.email}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h4 className="text-lg font-heading font-semibold text-brown-light mb-4">
                Hofkarte &amp; Mehr
              </h4>
              <ul className="space-y-2">
                {footerNavigation.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-cream/80 hover:text-brown-light transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Opening Hours */}
            <div>
              <h4 className="text-lg font-heading font-semibold text-brown-light mb-4">
                Hofzeiten &amp; Info
              </h4>
              <ul className="space-y-3 text-cream/80">
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 mt-0.5 text-brown/60 shrink-0" />
                  <span>{siteSettings.availabilityText}</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-cream/50">
                {siteSettings.phone || siteSettings.email
                  ? siteSettings.footerNote
                  : siteSettings.availabilityText}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-cream/10 py-6">
          <p className="text-center text-sm text-cream/40">
            &copy; {new Date().getFullYear()} {siteSettings.businessName}. Alle
            Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
