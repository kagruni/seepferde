"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useSiteData } from "@/components/common/SiteDataProvider";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { navLinks } = useSiteData();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [open, onClose]);

  return (
    <div
      ref={menuRef}
      className={`fixed inset-0 z-50 transition-all duration-400 ${
        open ? "visible" : "invisible"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-text/20 transition-opacity duration-400 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`absolute inset-y-0 right-0 w-full max-w-sm bg-cream shadow-2xl transition-transform duration-400 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <Image
              src="/icons/logo.svg"
              alt="See-Pferde Zwenkau"
              width={150}
              height={42}
              className="h-9 w-auto"
            />
            <button
              onClick={onClose}
              className="p-2 text-text hover:text-forest transition-colors cursor-pointer"
              aria-label="Menü schließen"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1 flex-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="text-2xl font-heading font-semibold text-text hover:text-forest py-3 border-b border-beige-dark/50 transition-colors duration-200"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="pt-6">
            <Button
              href="/kontakt"
              variant="primary"
              size="lg"
              className="w-full"
            >
              Buchen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
