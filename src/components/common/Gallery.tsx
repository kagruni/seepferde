"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/types";

interface GalleryProps {
  images: GalleryImage[];
  showFilters?: boolean;
  categoryLabels?: Record<string, string>;
  emptyState?: string;
}

const DEFAULT_CATEGORY_LABELS: Record<string, string> = {
  hof: "Hof",
  pferde: "Pferde",
  coaching: "Coaching",
  workshops: "Workshops",
  events: "Events",
};

export default function Gallery({
  images,
  showFilters = true,
  categoryLabels = DEFAULT_CATEGORY_LABELS,
  emptyState = "In dieser Kategorie sind aktuell keine Bilder veröffentlicht.",
}: GalleryProps) {
  const [filter, setFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    filter === "all" ? images : images.filter((img) => img.category === filter);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  const next = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null));

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowLeft") {
        setLightboxIndex((index) =>
          index !== null ? (index - 1 + filtered.length) % filtered.length : null
        );
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((index) =>
          index !== null ? (index + 1) % filtered.length : null
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, filtered.length]);

  const categories = [
    { key: "all", label: "Alle" },
    ...Object.entries(categoryLabels).map(([key, label]) => ({ key, label })),
  ];

  const selectFilter = (key: string) => {
    setFilter(key);
    setLightboxIndex(null);
  };

  return (
    <>
      {showFilters && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => selectFilter(cat.key)}
              aria-pressed={filter === cat.key}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                filter === cat.key
                  ? "bg-forest text-white"
                  : "bg-beige text-text-secondary hover:bg-beige-dark"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {filtered.map((img, i) => (
            <button
              key={img.slug ?? img.src}
              type="button"
              onClick={() => openLightbox(i)}
              className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
              aria-label={`${img.title}: Bild vergrößern`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-text/0 group-hover:bg-text/10 transition-colors duration-300" />
            </button>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-beige p-8 text-center text-text-secondary" role="status">
          {emptyState}
        </p>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-text/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Bildansicht: ${filtered[lightboxIndex].title}`}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors cursor-pointer z-10"
            aria-label="Schließen"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 text-white/80 hover:text-white transition-colors cursor-pointer z-10"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 text-white/80 hover:text-white transition-colors cursor-pointer z-10"
            aria-label="Nächstes Bild"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].alt}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          <p className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm px-4">
            {filtered[lightboxIndex].caption || filtered[lightboxIndex].title}
          </p>
        </div>
      )}
    </>
  );
}
