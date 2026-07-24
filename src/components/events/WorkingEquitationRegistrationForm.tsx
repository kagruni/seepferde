"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  LoaderCircle,
  Send,
} from "lucide-react";
import {
  EMPTY_WORKING_EQUITATION_FORM,
  WORKING_EQUITATION_EVENT,
  accommodationLabels,
  calculateWorkingEquitationBooking,
  createWorkingEquitationSubmission,
  formatEuro,
  validateWorkingEquitationForm,
  validateWorkingEquitationStep,
  type Accommodation,
  type FieldErrors,
  type WorkingEquitationFormData,
} from "@/lib/working-equitation-registration";

const STEPS = [
  "Teilnehmer",
  "Pferd",
  "Buchung",
  "Bedingungen",
  "Prüfen",
] as const;

const PARTICIPATION_ACKNOWLEDGEMENT_FIELDS = [
  "ownRisk",
  "helmetDuty",
  "liabilityLimitation",
  "horseLiabilityInsurance",
  "horseHealthy",
  "participationTerms",
] as const;

const fieldIds: Record<string, string> = {
  "participant.fullName": "we-full-name",
  "participant.street": "we-street",
  "participant.postalCode": "we-postal-code",
  "participant.city": "we-city",
  "participant.phone": "we-phone",
  "participant.email": "we-email",
  "horse.name": "we-horse-name",
  "horse.breed": "we-horse-breed",
  "horse.sex": "we-horse-sex",
  "horse.age": "we-horse-age",
  "acknowledgements.ownRisk": "we-participation-conditions",
  "acknowledgements.helmetDuty": "we-participation-conditions",
  "acknowledgements.liabilityLimitation": "we-participation-conditions",
  "acknowledgements.horseLiabilityInsurance": "we-participation-conditions",
  "acknowledgements.horseHealthy": "we-participation-conditions",
  "acknowledgements.participationTerms": "we-participation-conditions",
  "acknowledgements.cancellationTerms": "we-cancellation-terms",
  "acknowledgements.dataProcessing": "we-data-processing",
  photoChoice: "we-photo-consent-yes",
  typedParticipantName: "we-typed-name",
};

const inputClasses =
  "w-full rounded-xl border border-brown/30 bg-white px-4 py-3 text-text placeholder:text-text-light focus:border-gold focus:ring-2 focus:ring-gold/20";

interface SuccessState {
  reference: string;
  totalCents: number;
  acknowledgedAt: string;
  duplicate: boolean;
  confirmationEmailSent: boolean;
}

function cloneEmptyForm(): WorkingEquitationFormData {
  return {
    participant: { ...EMPTY_WORKING_EQUITATION_FORM.participant },
    horse: { ...EMPTY_WORKING_EQUITATION_FORM.horse },
    booking: { ...EMPTY_WORKING_EQUITATION_FORM.booking },
    acknowledgements: {
      ...EMPTY_WORKING_EQUITATION_FORM.acknowledgements,
    },
    photoChoice: "",
    typedParticipantName: "",
  };
}

function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (value) => {
    const random = Math.floor(Math.random() * 16);
    const nibble = value === "x" ? random : (random & 0x3) | 0x8;
    return nibble.toString(16);
  });
}

function focusFirstError(errors: FieldErrors) {
  const firstField = Object.keys(errors)[0];
  const id = fieldIds[firstField];
  if (!id) return;
  requestAnimationFrame(() => document.getElementById(id)?.focus());
}

export default function WorkingEquitationRegistrationForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<WorkingEquitationFormData>(
    cloneEmptyForm,
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submissionError, setSubmissionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(0);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusHeading = useRef(false);

  useEffect(() => {
    setIdempotencyKey(createIdempotencyKey());
    setFormStartedAt(Date.now());
  }, []);

  useEffect(() => {
    if (!shouldFocusHeading.current) return;
    shouldFocusHeading.current = false;
    stepHeadingRef.current?.focus();
  }, [step]);

  const booking = useMemo(
    () => calculateWorkingEquitationBooking(formData.booking),
    [formData.booking],
  );

  const updateParticipant = (
    field: keyof WorkingEquitationFormData["participant"],
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      participant: { ...current.participant, [field]: value },
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next[`participant.${field}`];
      return next;
    });
  };

  const updateHorse = (
    field: keyof WorkingEquitationFormData["horse"],
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      horse: { ...current.horse, [field]: value },
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next[`horse.${field}`];
      return next;
    });
  };

  const updateBooking = <Field extends keyof WorkingEquitationFormData["booking"]>(
    field: Field,
    value: WorkingEquitationFormData["booking"][Field],
  ) => {
    setFormData((current) => ({
      ...current,
      booking: { ...current.booking, [field]: value },
    }));
  };

  const updateAcknowledgement = (
    field: keyof WorkingEquitationFormData["acknowledgements"],
    checked: boolean,
  ) => {
    setFormData((current) => ({
      ...current,
      acknowledgements: {
        ...current.acknowledgements,
        [field]: checked,
      },
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next[`acknowledgements.${field}`];
      return next;
    });
  };

  const updateParticipationConditions = (checked: boolean) => {
    setFormData((current) => ({
      ...current,
      acknowledgements: {
        ...current.acknowledgements,
        ownRisk: checked,
        helmetDuty: checked,
        liabilityLimitation: checked,
        horseLiabilityInsurance: checked,
        horseHealthy: checked,
        participationTerms: checked,
      },
    }));
    setErrors((current) => {
      const next = { ...current };
      for (const field of PARTICIPATION_ACKNOWLEDGEMENT_FIELDS) {
        delete next[`acknowledgements.${field}`];
      }
      return next;
    });
  };

  const goToStep = (nextStep: number) => {
    shouldFocusHeading.current = true;
    setErrors({});
    setSubmissionError("");
    setStep(nextStep);
  };

  const continueToNextStep = () => {
    const stepErrors = validateWorkingEquitationStep(step, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      focusFirstError(stepErrors);
      return;
    }
    goToStep(Math.min(step + 1, STEPS.length - 1));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < STEPS.length - 1) {
      continueToNextStep();
      return;
    }

    const formErrors = validateWorkingEquitationForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      const firstField = Object.keys(formErrors)[0];
      const firstStep = firstField.startsWith("participant.")
        ? 0
        : firstField.startsWith("horse.")
          ? 1
          : 3;
      goToStep(firstStep);
      setErrors(formErrors);
      focusFirstError(formErrors);
      return;
    }

    if (!idempotencyKey || !formStartedAt || submitting) return;

    setSubmitting(true);
    setSubmissionError("");
    try {
      const response = await fetch(
        "/kursanmeldung/working-equitation.php",
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            createWorkingEquitationSubmission(
              formData,
              idempotencyKey,
              formStartedAt,
            ),
          ),
        },
      );
      const result = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            message?: string;
            fieldErrors?: FieldErrors;
            reference?: string;
            totalCents?: number;
            acknowledgedAt?: string;
            duplicate?: boolean;
            confirmationEmailSent?: boolean;
          }
        | null;

      if (!response.ok || !result?.success) {
        if (result?.fieldErrors) {
          setErrors(result.fieldErrors);
          const firstField = Object.keys(result.fieldErrors)[0];
          const firstStep = firstField.startsWith("participant.")
            ? 0
            : firstField.startsWith("horse.")
              ? 1
              : 3;
          goToStep(firstStep);
          setErrors(result.fieldErrors);
          focusFirstError(result.fieldErrors);
        }
        throw new Error(
          result?.message ||
            "Die Anmeldung konnte gerade nicht gesendet werden. Bitte versuchen Sie es erneut.",
        );
      }

      if (
        typeof result.reference !== "string" ||
        typeof result.totalCents !== "number" ||
        typeof result.acknowledgedAt !== "string"
      ) {
        throw new Error(
          "Die Anmeldung wurde nicht vollständig bestätigt. Bitte versuchen Sie es erneut.",
        );
      }

      setSuccess({
        reference: result.reference,
        totalCents: result.totalCents,
        acknowledgedAt: result.acknowledgedAt,
        duplicate: Boolean(result.duplicate),
        confirmationEmailSent: result.confirmationEmailSent !== false,
      });
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Die Anmeldung konnte gerade nicht gesendet werden. Bitte versuchen Sie es erneut.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <SuccessPanel success={success} participantName={formData.participant.fullName} />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <nav aria-label="Fortschritt der Kursanmeldung" className="mb-8">
        <ol className="grid grid-cols-5 gap-1 sm:gap-3">
          {STEPS.map((label, index) => {
            const active = index === step;
            const complete = index < step;
            return (
              <li
                key={label}
                aria-current={active ? "step" : undefined}
                className="min-w-0"
              >
                <div
                  className={`h-1.5 rounded-full motion-reduce:transition-none ${
                    index <= step ? "bg-gold" : "bg-brown/20"
                  }`}
                />
                <span
                  className={`mt-2 hidden text-xs sm:block ${
                    active
                      ? "font-semibold text-text"
                      : complete
                        ? "text-forest"
                        : "text-text-secondary"
                  }`}
                >
                  {complete ? (
                    <Check
                      className="mr-1 inline h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  ) : null}
                  {label}
                </span>
                <span className="sr-only">
                  Schritt {index + 1} von {STEPS.length}: {label}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-sm text-text-secondary sm:hidden">
          Schritt {step + 1} von {STEPS.length}: {STEPS[step]}
        </p>
      </nav>

      <h3
        ref={stepHeadingRef}
        tabIndex={-1}
        className="mb-6 text-2xl font-heading font-semibold outline-none"
      >
        {step === 0 && "Ihre Kontaktdaten"}
        {step === 1 && "Angaben zu Ihrem Pferd"}
        {step === 2 && "Kurs und Zusatzleistungen"}
        {step === 3 && "Bedingungen und Einwilligungen"}
        {step === 4 && "Anmeldung prüfen"}
      </h3>

      {step === 0 ? (
        <ParticipantStep
          data={formData.participant}
          errors={errors}
          onChange={updateParticipant}
        />
      ) : null}
      {step === 1 ? (
        <HorseStep
          data={formData.horse}
          errors={errors}
          onChange={updateHorse}
        />
      ) : null}
      {step === 2 ? (
        <BookingStep
          data={formData.booking}
          booking={booking}
          onChange={updateBooking}
        />
      ) : null}
      {step === 3 ? (
        <ConditionsStep
          formData={formData}
          errors={errors}
          onAcknowledgement={updateAcknowledgement}
          onParticipationConditions={updateParticipationConditions}
          onPhotoChoice={(photoChoice) => {
            setFormData((current) => ({ ...current, photoChoice }));
            setErrors((current) => {
              const next = { ...current };
              delete next.photoChoice;
              return next;
            });
          }}
          onTypedName={(typedParticipantName) => {
            setFormData((current) => ({
              ...current,
              typedParticipantName,
            }));
            setErrors((current) => {
              const next = { ...current };
              delete next.typedParticipantName;
              return next;
            });
          }}
        />
      ) : null}
      {step === 4 ? (
        <ReviewStep formData={formData} booking={booking} />
      ) : null}

      {submissionError ? (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {submissionError}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-brown/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => goToStep(step - 1)}
            disabled={submitting}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 font-semibold text-text-secondary hover:bg-beige/70 hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Zurück
          </button>
        ) : (
          <span />
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-gold-dark/30 bg-gold px-7 font-semibold text-white shadow-md shadow-gold-dark/20 hover:bg-gold-dark active:translate-y-px"
          >
            Weiter
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting || !idempotencyKey || !formStartedAt}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-gold-dark/30 bg-gold px-7 font-semibold text-white shadow-md shadow-gold-dark/20 hover:bg-gold-dark active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <LoaderCircle
                  className="h-5 w-5 animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
                Anmeldung wird gesendet
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden="true" />
                Verbindlich anmelden
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-text">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputErrorProps(id: string, error?: string) {
  return {
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  };
}

function ParticipantStep({
  data,
  errors,
  onChange,
}: {
  data: WorkingEquitationFormData["participant"];
  errors: FieldErrors;
  onChange: (
    field: keyof WorkingEquitationFormData["participant"],
    value: string,
  ) => void;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field
          id="we-full-name"
          label="Vor- und Nachname *"
          error={errors["participant.fullName"]}
        >
          <input
            id="we-full-name"
            name="fullName"
            autoComplete="name"
            value={data.fullName}
            onChange={(event) => onChange("fullName", event.target.value)}
            className={inputClasses}
            {...inputErrorProps(
              "we-full-name",
              errors["participant.fullName"],
            )}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field
          id="we-street"
          label="Straße und Hausnummer *"
          error={errors["participant.street"]}
        >
          <input
            id="we-street"
            name="street"
            autoComplete="street-address"
            value={data.street}
            onChange={(event) => onChange("street", event.target.value)}
            className={inputClasses}
            {...inputErrorProps("we-street", errors["participant.street"])}
          />
        </Field>
      </div>
      <Field
        id="we-postal-code"
        label="Postleitzahl *"
        error={errors["participant.postalCode"]}
      >
        <input
          id="we-postal-code"
          name="postalCode"
          autoComplete="postal-code"
          inputMode="numeric"
          maxLength={5}
          value={data.postalCode}
          onChange={(event) => onChange("postalCode", event.target.value)}
          className={inputClasses}
          {...inputErrorProps(
            "we-postal-code",
            errors["participant.postalCode"],
          )}
        />
      </Field>
      <Field
        id="we-city"
        label="Ort *"
        error={errors["participant.city"]}
      >
        <input
          id="we-city"
          name="city"
          autoComplete="address-level2"
          value={data.city}
          onChange={(event) => onChange("city", event.target.value)}
          className={inputClasses}
          {...inputErrorProps("we-city", errors["participant.city"])}
        />
      </Field>
      <Field
        id="we-phone"
        label="Telefon *"
        error={errors["participant.phone"]}
      >
        <input
          id="we-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={data.phone}
          onChange={(event) => onChange("phone", event.target.value)}
          className={inputClasses}
          {...inputErrorProps("we-phone", errors["participant.phone"])}
        />
      </Field>
      <Field
        id="we-email"
        label="E-Mail *"
        error={errors["participant.email"]}
      >
        <input
          id="we-email"
          name="email"
          type="email"
          autoComplete="email"
          value={data.email}
          onChange={(event) => onChange("email", event.target.value)}
          className={inputClasses}
          {...inputErrorProps("we-email", errors["participant.email"])}
        />
      </Field>
    </div>
  );
}

function HorseStep({
  data,
  errors,
  onChange,
}: {
  data: WorkingEquitationFormData["horse"];
  errors: FieldErrors;
  onChange: (
    field: keyof WorkingEquitationFormData["horse"],
    value: string,
  ) => void;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field
        id="we-horse-name"
        label="Name des Pferdes *"
        error={errors["horse.name"]}
      >
        <input
          id="we-horse-name"
          name="horseName"
          value={data.name}
          onChange={(event) => onChange("name", event.target.value)}
          className={inputClasses}
          {...inputErrorProps("we-horse-name", errors["horse.name"])}
        />
      </Field>
      <Field
        id="we-horse-breed"
        label="Rasse *"
        error={errors["horse.breed"]}
      >
        <input
          id="we-horse-breed"
          name="horseBreed"
          value={data.breed}
          onChange={(event) => onChange("breed", event.target.value)}
          className={inputClasses}
          {...inputErrorProps("we-horse-breed", errors["horse.breed"])}
        />
      </Field>
      <Field
        id="we-horse-sex"
        label="Geschlecht *"
        error={errors["horse.sex"]}
      >
        <input
          id="we-horse-sex"
          name="horseSex"
          value={data.sex}
          onChange={(event) => onChange("sex", event.target.value)}
          className={inputClasses}
          {...inputErrorProps("we-horse-sex", errors["horse.sex"])}
        />
      </Field>
      <Field
        id="we-horse-age"
        label="Alter in Jahren *"
        error={errors["horse.age"]}
      >
        <input
          id="we-horse-age"
          name="horseAge"
          type="number"
          min={1}
          max={40}
          inputMode="numeric"
          value={data.age}
          onChange={(event) => onChange("age", event.target.value)}
          className={inputClasses}
          {...inputErrorProps("we-horse-age", errors["horse.age"])}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field
          id="we-horse-requirements"
          label="Besonderheiten oder besondere Anforderungen (optional)"
        >
          <textarea
            id="we-horse-requirements"
            name="horseSpecialRequirements"
            rows={4}
            value={data.specialRequirements}
            onChange={(event) =>
              onChange("specialRequirements", event.target.value)
            }
            className={`${inputClasses} resize-y`}
            placeholder="Zum Beispiel Fütterung, Verhalten oder gesundheitliche Hinweise"
          />
        </Field>
      </div>
    </div>
  );
}

function BookingStep({
  data,
  booking,
  onChange,
}: {
  data: WorkingEquitationFormData["booking"];
  booking: ReturnType<typeof calculateWorkingEquitationBooking>;
  onChange: <Field extends keyof WorkingEquitationFormData["booking"]>(
    field: Field,
    value: WorkingEquitationFormData["booking"][Field],
  ) => void;
}) {
  return (
    <div className="space-y-7">
      <div className="rounded-xl border border-forest/20 bg-forest/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-text">
              2-tägiger Kurs mit eigenem Pferd
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              19.-20. September 2026
            </p>
          </div>
          <p className="shrink-0 font-heading text-xl font-semibold text-forest-dark">
            {formatEuro(42_000)}
          </p>
        </div>
      </div>

      <AccommodationChoices
        legend="Anreise am Freitag, 18. September 2026"
        name="fridayAccommodation"
        value={data.fridayAccommodation}
        onChange={(value) => onChange("fridayAccommodation", value)}
      />

      <DayOptions
        legend="Samstag, 19. September 2026"
        accommodationName="saturdayAccommodation"
        accommodation={data.saturdayAccommodation}
        catering={data.saturdayCatering}
        bemer={data.saturdayBemer}
        onAccommodation={(value) =>
          onChange("saturdayAccommodation", value)
        }
        onCatering={(value) => onChange("saturdayCatering", value)}
        onBemer={(value) => onChange("saturdayBemer", value)}
      />

      <DayOptions
        legend="Sonntag, 20. September 2026"
        accommodationName="sundayAccommodation"
        accommodation={data.sundayAccommodation}
        catering={data.sundayCatering}
        bemer={data.sundayBemer}
        onAccommodation={(value) => onChange("sundayAccommodation", value)}
        onCatering={(value) => onChange("sundayCatering", value)}
        onBemer={(value) => onChange("sundayBemer", value)}
      />

      <div className="rounded-xl border border-gold/25 bg-gold/8 px-4 py-3 text-sm leading-relaxed text-text">
        <strong>Wichtiger Hinweis:</strong> Futter sowie das Ausmisten der Box
        beziehungsweise der Weidefläche sind nicht im Preis enthalten und
        erfolgen durch den Teilnehmer.
      </div>

      <ItemizedTotal booking={booking} />
    </div>
  );
}

const accommodationOptions: Array<{
  value: Accommodation;
  label: string;
  price: number;
}> = [
  { value: "none", label: "Keine Unterbringung", price: 0 },
  { value: "outdoor_box", label: "Außenbox", price: 2_500 },
  { value: "panel_box", label: "Panelbox", price: 2_000 },
  {
    value: "self_fenced_pasture",
    label: "Weidefläche zur Selbsteinzäunung",
    price: 1_500,
  },
];

function AccommodationChoices({
  legend,
  name,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  value: Accommodation;
  onChange: (value: Accommodation) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 font-heading text-lg font-semibold text-text">
        {legend}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {accommodationOptions.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 ${
              value === option.value
                ? "border-forest bg-forest/5"
                : "border-brown/20 bg-white hover:border-brown/40"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mt-1 h-4 w-4 accent-forest"
            />
            <span className="flex min-w-0 flex-1 justify-between gap-3">
              <span>{option.label}</span>
              <span className="shrink-0 font-semibold">
                {option.price ? `+ ${formatEuro(option.price)}` : "0,00 €"}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function DayOptions({
  legend,
  accommodationName,
  accommodation,
  catering,
  bemer,
  onAccommodation,
  onCatering,
  onBemer,
}: {
  legend: string;
  accommodationName: string;
  accommodation: Accommodation;
  catering: boolean;
  bemer: boolean;
  onAccommodation: (value: Accommodation) => void;
  onCatering: (value: boolean) => void;
  onBemer: (value: boolean) => void;
}) {
  return (
    <div className="space-y-3">
      <AccommodationChoices
        legend={legend}
        name={accommodationName}
        value={accommodation}
        onChange={onAccommodation}
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <OptionCheckbox
          label="Verpflegung (Getränke, Snacks und Mittagessen)"
          price={2_000}
          checked={catering}
          onChange={onCatering}
        />
        <OptionCheckbox
          label="15-minütige BEMER-Anwendung"
          price={2_500}
          checked={bemer}
          onChange={onBemer}
        />
      </div>
    </div>
  );
}

function OptionCheckbox({
  label,
  price,
  checked,
  onChange,
}: {
  label: string;
  price: number;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 ${
        checked
          ? "border-forest bg-forest/5"
          : "border-brown/20 bg-white hover:border-brown/40"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-forest"
      />
      <span className="flex min-w-0 flex-1 justify-between gap-3">
        <span>{label}</span>
        <span className="shrink-0 font-semibold">+ {formatEuro(price)}</span>
      </span>
    </label>
  );
}

function ConditionsStep({
  formData,
  errors,
  onAcknowledgement,
  onParticipationConditions,
  onPhotoChoice,
  onTypedName,
}: {
  formData: WorkingEquitationFormData;
  errors: FieldErrors;
  onAcknowledgement: (
    field: keyof WorkingEquitationFormData["acknowledgements"],
    checked: boolean,
  ) => void;
  onParticipationConditions: (checked: boolean) => void;
  onPhotoChoice: (choice: "consent" | "decline") => void;
  onTypedName: (value: string) => void;
}) {
  const participationConditionsAccepted =
    PARTICIPATION_ACKNOWLEDGEMENT_FIELDS.every(
      (field) => formData.acknowledgements[field],
    );
  const participationConditionsError =
    PARTICIPATION_ACKNOWLEDGEMENT_FIELDS.map(
      (field) => errors[`acknowledgements.${field}`],
    ).find(Boolean);

  return (
    <div className="space-y-8">
      <section aria-labelledby="we-participation-heading">
        <h4
          id="we-participation-heading"
          className="mb-3 text-lg font-heading font-semibold"
        >
          Teilnahmebedingungen
        </h4>
        <div className="rounded-xl border border-brown/20 bg-beige/45 p-5">
          <p className="text-sm font-semibold text-text">
            Mit der gemeinsamen Bestätigung erkläre ich:
          </p>
          <ul className="mt-3 space-y-2 pl-5 text-sm leading-relaxed text-text-secondary marker:text-forest">
            <li>Die Teilnahme erfolgt auf eigene Gefahr.</li>
            <li>
              Während des gesamten Kurses gilt Helmpflicht, sobald ich mich auf
              dem Pferd befinde.
            </li>
            <li>
              Der Veranstalter übernimmt keine Haftung für Personen-, Sach-
              oder Vermögensschäden, soweit gesetzlich zulässig.
            </li>
            <li>
              Für das Pferd besteht eine gültige Haftpflichtversicherung.
            </li>
            <li>
              Das Pferd ist gesund und frei von ansteckenden Krankheiten.
            </li>
            <li>Ich erkenne diese Teilnahmebedingungen an.</li>
          </ul>
          <div className="mt-5 border-t border-brown/15 pt-4">
            <Acknowledgement
              id="we-participation-conditions"
              checked={participationConditionsAccepted}
              error={participationConditionsError}
              onChange={onParticipationConditions}
            >
              Ich habe alle oben aufgeführten Teilnahmebedingungen gelesen und
              akzeptiere sie gemeinsam.
            </Acknowledgement>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="we-cancellation-heading"
        className="rounded-xl border border-brown/20 bg-beige/45 p-5"
      >
        <h4
          id="we-cancellation-heading"
          className="text-lg font-heading font-semibold"
        >
          Stornierungsbedingungen
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Eine Stornierung der Kursteilnahme ist schriftlich mitzuteilen.
        </p>
        <ul className="mt-3 space-y-2 pl-5 text-sm leading-relaxed text-text-secondary marker:text-forest">
          <li>
            Bis einen Monat vor Kursbeginn werden 70 % der Kursgebühr
            zurückerstattet.
          </li>
          <li>
            Bei einer Stornierung weniger als 21 Tage vor Kursbeginn werden 10 %
            der Kursgebühr zurückerstattet. 90 % werden als Stornogebühr
            einbehalten.
          </li>
          <li>
            Bei einer Stornierung weniger als 8 Tage vor Kursbeginn erfolgt
            keine Rückerstattung.
          </li>
          <li>
            Wird kurzfristig ein Ersatz gefunden, wird die Kursgebühr abzüglich
            einer Bearbeitungsgebühr von 50,00 € zurückbezahlt. Wird kein Ersatz
            gefunden, gelten die genannten Stornierungsbedingungen.
          </li>
          <li>
            Nicht in Anspruch genommene Leistungen aufgrund verspäteter
            Anreise, vorzeitiger Abreise oder Nichtteilnahme am Kurs werden
            nicht erstattet.
          </li>
        </ul>
        <div className="mt-4">
          <Acknowledgement
            id="we-cancellation-terms"
            checked={formData.acknowledgements.cancellationTerms}
            error={errors["acknowledgements.cancellationTerms"]}
            onChange={(checked) =>
              onAcknowledgement("cancellationTerms", checked)
            }
          >
            Ich habe die Stornierungsbedingungen gelesen und akzeptiere sie.
          </Acknowledgement>
        </div>
      </section>

      <section aria-labelledby="we-data-heading">
        <h4
          id="we-data-heading"
          className="mb-3 text-lg font-heading font-semibold"
        >
          Datenschutz
        </h4>
        <Acknowledgement
          id="we-data-processing"
          checked={formData.acknowledgements.dataProcessing}
          error={errors["acknowledgements.dataProcessing"]}
          onChange={(checked) =>
            onAcknowledgement("dataProcessing", checked)
          }
        >
          Ich bin damit einverstanden, dass meine personenbezogenen Daten
          ausschließlich zur Durchführung des Kurses gespeichert und
          verarbeitet werden. Weitere Informationen stehen in der{" "}
          <a
            href="/datenschutz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-forest underline underline-offset-4"
          >
            Datenschutzerklärung
          </a>
          .
        </Acknowledgement>
      </section>

      <fieldset id="we-photo-consent">
        <legend className="text-lg font-heading font-semibold">
          Foto- und Videoeinwilligung
        </legend>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Während des Kurses können Foto- und Videoaufnahmen erstellt werden.
          Die Einwilligung ist freiwillig und kann jederzeit mit Wirkung für die
          Zukunft widerrufen werden. Bereits veröffentlichte Druckerzeugnisse
          können nachträglich nicht mehr zurückgerufen werden.
        </p>
        <div className="mt-3 space-y-3">
          <PhotoChoice
            id="we-photo-consent-yes"
            name="photoChoice"
            value="consent"
            checked={formData.photoChoice === "consent"}
            error={errors.photoChoice}
            onChange={() => onPhotoChoice("consent")}
          >
            Ich bin damit einverstanden, dass Foto- und Videoaufnahmen, auf
            denen ich und/oder mein Pferd zu sehen sind, vom Veranstalter für
            Öffentlichkeitsarbeit und Werbung (zum Beispiel Website, Social
            Media, Flyer und Printmedien) unentgeltlich verwendet und
            veröffentlicht werden dürfen.
          </PhotoChoice>
          <PhotoChoice
            id="we-photo-consent-no"
            name="photoChoice"
            value="decline"
            checked={formData.photoChoice === "decline"}
            error={errors.photoChoice}
            onChange={() => onPhotoChoice("decline")}
          >
            Ich bin nicht damit einverstanden, dass Foto- und Videoaufnahmen von
            mir und/oder meinem Pferd veröffentlicht werden.
          </PhotoChoice>
        </div>
        {errors.photoChoice ? (
          <p
            id="we-photo-consent-error"
            className="mt-2 text-sm font-medium text-red-800"
          >
            {errors.photoChoice}
          </p>
        ) : null}
      </fieldset>

      <div className="rounded-xl border border-forest/20 bg-forest/5 p-5">
        <Field
          id="we-typed-name"
          label="Digitale Bestätigung: Vor- und Nachname *"
          error={errors.typedParticipantName}
        >
          <input
            id="we-typed-name"
            name="typedParticipantName"
            autoComplete="name"
            value={formData.typedParticipantName}
            onChange={(event) => onTypedName(event.target.value)}
            className={inputClasses}
            {...inputErrorProps(
              "we-typed-name",
              errors.typedParticipantName,
            )}
          />
        </Field>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Mit diesem Namen bestätigen Sie die Angaben digital. Der genaue
          Zeitpunkt wird beim Absenden serverseitig protokolliert. Dies ist
          keine handschriftliche Unterschrift.
        </p>
      </div>
    </div>
  );
}

function Acknowledgement({
  id,
  checked,
  error,
  onChange,
  children,
}: {
  id: string;
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brown/20 bg-white px-4 py-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-forest"
          {...inputErrorProps(id, error)}
        />
        <span className="text-sm leading-relaxed text-text">{children}</span>
      </label>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PhotoChoice({
  id,
  name,
  value,
  checked,
  error,
  onChange,
  children,
}: {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  error?: string;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 ${
        checked
          ? "border-forest bg-forest/5"
          : "border-brown/20 bg-white"
      }`}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 shrink-0 accent-forest"
        aria-describedby={error ? "we-photo-consent-error" : undefined}
      />
      <span className="text-sm leading-relaxed text-text">{children}</span>
    </label>
  );
}

function ReviewStep({
  formData,
  booking,
}: {
  formData: WorkingEquitationFormData;
  booking: ReturnType<typeof calculateWorkingEquitationBooking>;
}) {
  const consentLabels = [
    ["Teilnahme auf eigene Gefahr", formData.acknowledgements.ownRisk],
    ["Helmpflicht", formData.acknowledgements.helmetDuty],
    ["Haftungsbeschränkung", formData.acknowledgements.liabilityLimitation],
    [
      "Gültige Pferdehaftpflicht",
      formData.acknowledgements.horseLiabilityInsurance,
    ],
    ["Pferd gesund und nicht ansteckend", formData.acknowledgements.horseHealthy],
    ["Teilnahmebedingungen", formData.acknowledgements.participationTerms],
    ["Stornierungsbedingungen", formData.acknowledgements.cancellationTerms],
    ["Datenverarbeitung", formData.acknowledgements.dataProcessing],
  ] as const;

  return (
    <div className="space-y-6">
      <ReviewSection title="Veranstaltung">
        <ReviewRow label="Kurs" value={WORKING_EQUITATION_EVENT.title} />
        <ReviewRow label="Termin" value={WORKING_EQUITATION_EVENT.dateLabel} />
        <ReviewRow label="Ort" value={WORKING_EQUITATION_EVENT.location} />
      </ReviewSection>

      <ReviewSection title="Teilnehmer">
        <ReviewRow label="Name" value={formData.participant.fullName} />
        <ReviewRow label="Straße" value={formData.participant.street} />
        <ReviewRow
          label="PLZ / Ort"
          value={`${formData.participant.postalCode} ${formData.participant.city}`}
        />
        <ReviewRow label="Telefon" value={formData.participant.phone} />
        <ReviewRow label="E-Mail" value={formData.participant.email} />
      </ReviewSection>

      <ReviewSection title="Pferd">
        <ReviewRow label="Name" value={formData.horse.name} />
        <ReviewRow label="Rasse" value={formData.horse.breed} />
        <ReviewRow label="Geschlecht" value={formData.horse.sex} />
        <ReviewRow label="Alter" value={`${formData.horse.age} Jahre`} />
        <ReviewRow
          label="Besonderheiten"
          value={formData.horse.specialRequirements || "Keine angegeben"}
        />
      </ReviewSection>

      <ReviewSection title="Auswahl">
        <ReviewRow
          label="Freitag"
          value={accommodationLabels[formData.booking.fridayAccommodation]}
        />
        <ReviewRow
          label="Samstag"
          value={[
            accommodationLabels[formData.booking.saturdayAccommodation],
            formData.booking.saturdayCatering ? "Verpflegung" : "",
            formData.booking.saturdayBemer ? "BEMER" : "",
          ]
            .filter(Boolean)
            .join(", ")}
        />
        <ReviewRow
          label="Sonntag"
          value={[
            accommodationLabels[formData.booking.sundayAccommodation],
            formData.booking.sundayCatering ? "Verpflegung" : "",
            formData.booking.sundayBemer ? "BEMER" : "",
          ]
            .filter(Boolean)
            .join(", ")}
        />
        <div className="mt-4">
          <ItemizedTotal booking={booking} />
        </div>
      </ReviewSection>

      <ReviewSection title="Bestätigungen und Einwilligungen">
        <ul className="grid gap-2 sm:grid-cols-2">
          {consentLabels.map(([label, accepted]) => (
            <li key={label} className="flex items-start gap-2 text-sm">
              <CheckCircle2
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  accepted ? "text-forest" : "text-red-800"
                }`}
                aria-hidden="true"
              />
              {label}: {accepted ? "bestätigt" : "nicht bestätigt"}
            </li>
          ))}
          <li className="flex items-start gap-2 text-sm">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-forest"
              aria-hidden="true"
            />
            Foto / Video:{" "}
            {formData.photoChoice === "consent"
              ? "Einwilligung erteilt"
              : "Keine Einwilligung"}
          </li>
          <li className="flex items-start gap-2 text-sm">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-forest"
              aria-hidden="true"
            />
            Digitale Bestätigung: {formData.typedParticipantName}
          </li>
        </ul>
      </ReviewSection>

      <p className="text-sm leading-relaxed text-text-secondary">
        Bitte prüfen Sie alle Angaben. Der Gesamtbetrag wird beim Absenden auf
        dem Server erneut berechnet. Nach erfolgreicher Annahme erhalten Sie die
        Zahlungsdaten und eine Referenznummer.
      </p>
    </div>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-brown/20 bg-white p-5">
      <h4 className="mb-3 text-lg font-heading font-semibold">{title}</h4>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 text-sm sm:grid-cols-[9rem_1fr]">
      <p className="font-semibold text-text-secondary">{label}</p>
      <p className="break-words text-text">{value}</p>
    </div>
  );
}

function ItemizedTotal({
  booking,
}: {
  booking: ReturnType<typeof calculateWorkingEquitationBooking>;
}) {
  return (
    <div className="rounded-xl border border-brown/20 bg-white p-5">
      <h4 className="font-heading text-lg font-semibold">Preisübersicht</h4>
      <dl className="mt-3 space-y-2">
        {booking.items.map((item) => (
          <div
            key={item.code}
            className="flex items-start justify-between gap-4 text-sm"
          >
            <dt className="text-text-secondary">{item.label}</dt>
            <dd className="shrink-0 font-semibold text-text">
              {formatEuro(item.amountCents)}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-brown/15 pt-4">
        <span className="font-semibold">Gesamtbetrag</span>
        <strong className="font-heading text-2xl text-forest-dark">
          {formatEuro(booking.totalCents)}
        </strong>
      </div>
    </div>
  );
}

function SuccessPanel({
  success,
  participantName,
}: {
  success: SuccessState;
  participantName: string;
}) {
  const acknowledgedAt = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  }).format(new Date(success.acknowledgedAt));

  return (
    <div role="status" className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest/10">
          <CheckCircle2 className="h-8 w-8 text-forest" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-2xl font-heading font-semibold">
          Anmeldung angenommen
        </h3>
        <p className="mt-2 text-text-secondary">
          {success.duplicate
            ? "Diese Anmeldung wurde bereits erfasst. Es wurde kein Duplikat angelegt."
            : "Vielen Dank. Ihre Kursanmeldung wurde sicher gespeichert."}
        </p>
      </div>

      <dl className="grid gap-3 rounded-xl border border-forest/20 bg-forest/5 p-5 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-semibold text-text-secondary">Referenz</dt>
          <dd className="mt-1 font-semibold text-text">{success.reference}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-text-secondary">
            Verbindlicher Gesamtbetrag
          </dt>
          <dd className="mt-1 font-heading text-xl font-semibold text-text">
            {formatEuro(success.totalCents)}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm font-semibold text-text-secondary">
            Digital bestätigt
          </dt>
          <dd className="mt-1 text-text">
            {participantName}, {acknowledgedAt} Uhr
          </dd>
        </div>
      </dl>

      <section className="rounded-xl border border-gold/25 bg-gold/8 p-5">
        <h4 className="text-xl font-heading font-semibold">
          Zahlung innerhalb von sieben Tagen
        </h4>
        <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[10rem_1fr]">
          <dt className="font-semibold text-text-secondary">Kontoinhaber</dt>
          <dd>K &amp; P Hausmanagement OHG</dd>
          <dt className="font-semibold text-text-secondary">Bank</dt>
          <dd>Stadt- und Kreissparkasse Leipzig</dd>
          <dt className="font-semibold text-text-secondary">IBAN</dt>
          <dd className="break-all font-semibold">DE03 8605 5592 1090 2121 58</dd>
          <dt className="font-semibold text-text-secondary">BIC</dt>
          <dd className="font-semibold">WELADE8LXXX</dd>
          <dt className="font-semibold text-text-secondary">
            Verwendungszweck
          </dt>
          <dd>
            Working Equitation + {participantName} + 19.-20.09.2026
          </dd>
        </dl>
      </section>

      {success.confirmationEmailSent ? (
        <p className="text-sm leading-relaxed text-text-secondary">
          Eine Bestätigung mit der vollständigen Auswahl wurde an Ihre
          E-Mail-Adresse versendet. Bitte bewahren Sie die Referenznummer für
          Rückfragen auf.
        </p>
      ) : (
        <p className="rounded-xl border border-gold/30 bg-gold/8 px-4 py-3 text-sm leading-relaxed text-text">
          Ihre Anmeldung ist gespeichert. Die Bestätigungs-E-Mail konnte jedoch
          nicht versendet werden. Bitte notieren Sie die Referenznummer und
          verwenden Sie die oben stehenden Zahlungsdaten.
        </p>
      )}
    </div>
  );
}
