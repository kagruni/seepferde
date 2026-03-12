"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import MultiStepForm from "./MultiStepForm";

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  preselectedSubject?: string;
}

export default function FormModal({
  open,
  onClose,
  preselectedSubject,
}: FormModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  /* Lock body scroll when open */
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

  /* Escape key to close */
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
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        open ? "visible" : "invisible pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Anfrage-Formular"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-text/20 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto mx-4 rounded-2xl bg-white shadow-2xl p-6 sm:p-8 transition-all duration-300 ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-text-secondary hover:text-text transition-colors cursor-pointer rounded-lg hover:bg-beige/50"
          aria-label="Formular schließen"
        >
          <X className="w-5 h-5" />
        </button>

        <MultiStepForm
          variant="modal"
          preselectedSubject={preselectedSubject}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
