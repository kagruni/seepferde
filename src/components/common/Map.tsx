"use client";

import { MapPin } from "lucide-react";
import { useCookieConsent } from "./CookieConsent";

export default function Map({
  className = "",
  embedUrl,
  title = "Standort See-Pferde Zwenkau",
}: {
  className?: string;
  embedUrl: string;
  title?: string;
}) {
  const consent = useCookieConsent();

  return (
    <div className={`rounded-xl overflow-hidden shadow-sm border border-brown/12 ${className}`}>
      {consent === "accepted" ? (
        <iframe
          title={title}
          src={embedUrl}
          width="100%"
          height="350"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 bg-beige text-center px-6 py-16" style={{ minHeight: 350 }}>
          <MapPin className="w-10 h-10 text-brown/40" />
          <p className="text-text font-semibold">Karte nicht verfügbar</p>
          <p className="text-text-secondary text-sm max-w-xs">
            Bitte akzeptieren Sie Cookies, um die eingebettete Karte von OpenStreetMap anzuzeigen.
          </p>
        </div>
      )}
    </div>
  );
}
