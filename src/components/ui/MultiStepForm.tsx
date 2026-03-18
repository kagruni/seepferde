"use client";

import { useState, useCallback } from "react";
import { Send, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";
import { useSiteData } from "@/components/common/SiteDataProvider";

interface MultiStepFormProps {
  preselectedSubject?: string;
  variant: "inline" | "modal";
  onClose?: () => void;
}

interface FormData {
  subjects: string[];
  groupSize: string;
  preferredTime: string;
  occasion: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const TOTAL_STEPS = 4;

const inputClasses =
  "w-full px-4 py-3 rounded-xl border border-beige-dark bg-cream/50 text-text placeholder:text-text-light focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all duration-200";

export default function MultiStepForm({
  preselectedSubject,
  variant,
  onClose,
}: MultiStepFormProps) {
  const { contactSubjects, mailtoEmail } = useSiteData();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const [formData, setFormData] = useState<FormData>({
    subjects: preselectedSubject ? [preselectedSubject] : [],
    groupSize: "",
    preferredTime: "",
    occasion: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleFieldChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const toggleSubject = useCallback((subject: string) => {
    setFormData((prev) => {
      const has = prev.subjects.includes(subject);
      return {
        ...prev,
        subjects: has
          ? prev.subjects.filter((s) => s !== subject)
          : [...prev.subjects, subject],
      };
    });
  }, []);

  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case 1:
        return formData.subjects.length > 0;
      case 2:
        return true; // all fields optional in step 2
      case 3:
        return formData.name.trim() !== "" && formData.email.trim() !== "";
      case 4:
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  const goNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS && canProceed()) {
      setDirection("forward");
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, canProceed]);

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setDirection("backward");
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(() => {
    const subjectStr = formData.subjects.join(", ");
    const mailtoSubject = encodeURIComponent(
      `Anfrage: ${subjectStr} — ${formData.name}`
    );

    const lines: string[] = [
      `Name: ${formData.name}`,
      `E-Mail: ${formData.email}`,
      `Telefon: ${formData.phone || "nicht angegeben"}`,
      `Firma/Organisation: ${formData.company || "nicht angegeben"}`,
      "",
      `Angebot(e): ${subjectStr}`,
      `Gruppengröße: ${formData.groupSize || "nicht angegeben"}`,
      `Wunschzeitraum: ${formData.preferredTime || "nicht angegeben"}`,
      `Anlass/Kontext: ${formData.occasion || "nicht angegeben"}`,
    ];

    if (formData.message) {
      lines.push("", `Nachricht:`, formData.message);
    }

    const mailtoBody = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${mailtoEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
    setSubmitted(true);
  }, [formData, mailtoEmail]);

  const handleReset = useCallback(() => {
    setSubmitted(false);
    setCurrentStep(1);
    setFormData({
      subjects: preselectedSubject ? [preselectedSubject] : [],
      groupSize: "",
      preferredTime: "",
      occasion: "",
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    });
  }, [preselectedSubject]);

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-7 h-7 text-forest" />
        </div>
        <h3 className="text-2xl font-heading font-semibold mb-2">
          Vielen Dank!
        </h3>
        <p className="text-text-secondary">
          Ihr E-Mail-Programm sollte sich geöffnet haben. Falls nicht, schreiben
          Sie uns bitte direkt eine E-Mail.
        </p>
        <button
          className="mt-6 text-forest underline underline-offset-4 hover:text-forest-dark transition-colors cursor-pointer"
          onClick={handleReset}
        >
          Neue Nachricht schreiben
        </button>
      </div>
    );
  }

  const stepTitles = [
    "Was interessiert Sie?",
    "Erzählen Sie uns mehr",
    "Wie erreichen wir Sie?",
    "Zusammenfassung",
  ];

  return (
    <div>
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isComplete = step < currentStep;
          return (
            <div
              key={step}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-forest w-6"
                  : isComplete
                  ? "bg-forest/60"
                  : "bg-brown/20"
              }`}
            />
          );
        })}
      </div>

      {/* Step title */}
      <h3 className="text-xl font-heading font-semibold text-center mb-6">
        {stepTitles[currentStep - 1]}
      </h3>

      {/* Step content with transitions */}
      <div className="relative overflow-hidden">
        <div
          key={currentStep}
          className={`transition-all duration-300 ease-out ${
            direction === "forward"
              ? "animate-slide-in-right"
              : "animate-slide-in-left"
          }`}
        >
          {currentStep === 1 && (
            <StepSubjects
              subjects={contactSubjects}
              selected={formData.subjects}
              onToggle={toggleSubject}
            />
          )}
          {currentStep === 2 && (
            <StepDetails formData={formData} onChange={handleFieldChange} />
          )}
          {currentStep === 3 && (
            <StepContact formData={formData} onChange={handleFieldChange} />
          )}
          {currentStep === 4 && (
            <StepSummary formData={formData} onChange={handleFieldChange} />
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8 gap-3">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            Zurück
          </button>
        ) : variant === "modal" && onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text transition-colors cursor-pointer font-body"
          >
            Abbrechen
          </button>
        ) : (
          <div />
        )}

        {currentStep < TOTAL_STEPS ? (
          <Button
            variant="primary"
            size="md"
            onClick={goNext}
            className={`${
              !canProceed() ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Weiter
            <ChevronRight className="w-4 h-4 ml-1.5" />
          </Button>
        ) : (
          <Button variant="primary" size="md" onClick={handleSubmit}>
            <Send className="w-4 h-4 mr-2" />
            Anfrage senden
          </Button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 1 — Subject selection                                          */
/* ------------------------------------------------------------------ */

function StepSubjects({
  subjects,
  selected,
  onToggle,
}: {
  subjects: string[];
  selected: string[];
  onToggle: (subject: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {subjects.map((subject) => {
        const isSelected = selected.includes(subject);
        return (
          <button
            key={subject}
            type="button"
            onClick={() => onToggle(subject)}
            className={`relative text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              isSelected
                ? "border-forest bg-forest/5"
                : "border-brown/12 bg-white hover:border-brown/25"
            }`}
          >
            <span className="font-body text-sm font-medium text-text">
              {subject}
            </span>
            {isSelected && (
              <span className="absolute top-2.5 right-3">
                <Check className="w-4 h-4 text-forest" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 2 — Details                                                    */
/* ------------------------------------------------------------------ */

function StepDetails({
  formData,
  onChange,
}: {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="groupSize" className="block text-sm font-semibold mb-1.5">
          Gruppengröße
        </label>
        <input
          id="groupSize"
          name="groupSize"
          type="number"
          min={1}
          value={formData.groupSize}
          onChange={onChange}
          placeholder="z.B. 8"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="preferredTime" className="block text-sm font-semibold mb-1.5">
          Wunschzeitraum
        </label>
        <input
          id="preferredTime"
          name="preferredTime"
          type="text"
          value={formData.preferredTime}
          onChange={onChange}
          placeholder="z.B. März 2026"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="occasion" className="block text-sm font-semibold mb-1.5">
          Anlass / Kontext{" "}
          <span className="font-normal text-text-light">(optional)</span>
        </label>
        <textarea
          id="occasion"
          name="occasion"
          rows={3}
          value={formData.occasion}
          onChange={onChange}
          placeholder="z.B. Firmenevent, Geburtstag, Weiterbildung..."
          className={`${inputClasses} resize-y`}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 3 — Contact info                                               */
/* ------------------------------------------------------------------ */

function StepContact({
  formData,
  onChange,
}: {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold mb-1.5">
          Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={onChange}
          placeholder="Ihr Name"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
          E-Mail *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={onChange}
          placeholder="ihre@email.de"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold mb-1.5">
          Telefon{" "}
          <span className="font-normal text-text-light">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={onChange}
          placeholder="Optional"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-semibold mb-1.5">
          Firma / Organisation{" "}
          <span className="font-normal text-text-light">(optional)</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={onChange}
          placeholder="Optional"
          className={inputClasses}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 4 — Summary                                                    */
/* ------------------------------------------------------------------ */

function StepSummary({
  formData,
  onChange,
}: {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  const rows: { label: string; value: string }[] = [
    { label: "Angebot(e)", value: formData.subjects.join(", ") },
    { label: "Name", value: formData.name },
    { label: "E-Mail", value: formData.email },
  ];

  if (formData.phone) rows.push({ label: "Telefon", value: formData.phone });
  if (formData.company)
    rows.push({ label: "Firma / Organisation", value: formData.company });
  if (formData.groupSize)
    rows.push({ label: "Gruppengröße", value: formData.groupSize });
  if (formData.preferredTime)
    rows.push({ label: "Wunschzeitraum", value: formData.preferredTime });
  if (formData.occasion)
    rows.push({ label: "Anlass / Kontext", value: formData.occasion });

  return (
    <div className="space-y-5">
      <div className="bg-cream/60 rounded-xl border border-beige-dark p-4 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-3 text-sm">
            <span className="font-semibold text-text-secondary min-w-[130px] shrink-0">
              {row.label}:
            </span>
            <span className="text-text">{row.value}</span>
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold mb-1.5">
          Ergänzende Nachricht{" "}
          <span className="font-normal text-text-light">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          value={formData.message}
          onChange={onChange}
          placeholder="Haben Sie noch Fragen oder Anmerkungen?"
          className={`${inputClasses} resize-y`}
        />
      </div>
    </div>
  );
}
