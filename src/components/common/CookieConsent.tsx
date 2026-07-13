"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";

const COOKIE_KEY = "cookie-consent";

type Consent = "accepted" | "declined" | null;

// Simple external store so all components react to consent changes
const listeners = new Set<() => void>();
function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(COOKIE_KEY) as Consent;
}
function notifyListeners() {
  listeners.forEach((l) => l());
}

export function useCookieConsent() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    getConsent,
    () => null,
  );
}

function setConsent(value: "accepted" | "declined") {
  localStorage.setItem(COOKIE_KEY, value);
  notifyListeners();
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const consent = useCookieConsent();

  useEffect(() => {
    if (!consent) setVisible(true);
    else setVisible(false);
  }, [consent]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-brown/15 p-6 sm:p-8">
        <p className="text-text font-heading font-semibold text-lg mb-2">
          Cookie-Einstellungen
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">
          Wir verwenden technisch notwendige Cookies für den Betrieb dieser Website.
          Eingebettete Inhalte (z.&nbsp;B. Karten) können zusätzliche Cookies setzen.
          Weitere Informationen finden Sie in unserer{" "}
          <Link href="/datenschutz" className="text-forest underline hover:text-forest-dark">
            Datenschutzerklärung
          </Link>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setConsent("accepted")}
            className="px-6 py-2.5 bg-forest text-white text-sm font-semibold rounded-xl hover:bg-forest-dark transition-colors cursor-pointer"
          >
            Alle akzeptieren
          </button>
          <button
            onClick={() => setConsent("declined")}
            className="px-6 py-2.5 bg-beige text-text text-sm font-semibold rounded-xl hover:bg-brown/15 transition-colors cursor-pointer"
          >
            Nur notwendige
          </button>
        </div>
      </div>
    </div>
  );
}
