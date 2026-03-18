"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AdminRedirectPage() {
  useEffect(() => {
    window.location.replace("/admin/index.html");
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-heading mb-3">CMS wird geöffnet</h1>
        <p className="text-text-secondary mb-6">
          Falls die Weiterleitung nicht automatisch erfolgt, öffnen Sie das CMS direkt.
        </p>
        <Link
          href="/admin/index.html"
          className="inline-flex rounded-xl bg-forest px-5 py-3 text-white hover:bg-forest-dark transition-colors"
        >
          Decap CMS öffnen
        </Link>
      </div>
    </main>
  );
}
