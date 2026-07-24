export const WORKING_EQUITATION_EVENT_ID =
  "working-equitation-manuel-heindl-september-2026";

export const WORKING_EQUITATION_EVENT = {
  title: "Working-Equitation-Kurs mit Manuel Heindl",
  dateLabel: "19.-20. September 2026",
  location: "Hafenstraße 20, 04442 Zwenkau",
  basePriceCents: 42_000,
} as const;

export const WORKING_EQUITATION_PDF_PATH =
  "/downloads/anmeldeformular-working-equitation-kurs-september-2026.pdf";

export type Accommodation =
  | "none"
  | "outdoor_box"
  | "panel_box"
  | "self_fenced_pasture";

export type PhotoChoice = "" | "consent" | "decline";

export interface WorkingEquitationFormData {
  participant: {
    fullName: string;
    street: string;
    postalCode: string;
    city: string;
    phone: string;
    email: string;
  };
  horse: {
    name: string;
    breed: string;
    sex: string;
    age: string;
    specialRequirements: string;
  };
  booking: {
    fridayAccommodation: Accommodation;
    saturdayAccommodation: Accommodation;
    saturdayCatering: boolean;
    saturdayBemer: boolean;
    sundayAccommodation: Accommodation;
    sundayCatering: boolean;
    sundayBemer: boolean;
  };
  acknowledgements: {
    ownRisk: boolean;
    helmetDuty: boolean;
    liabilityLimitation: boolean;
    horseLiabilityInsurance: boolean;
    horseHealthy: boolean;
    participationTerms: boolean;
    cancellationTerms: boolean;
    dataProcessing: boolean;
  };
  photoChoice: PhotoChoice;
  typedParticipantName: string;
}

export interface BookingItem {
  code: string;
  label: string;
  amountCents: number;
}

export interface RegistrationSubmissionPayload
  extends WorkingEquitationFormData {
  eventId: typeof WORKING_EQUITATION_EVENT_ID;
  idempotencyKey: string;
  formStartedAt: number;
  website: string;
}

export type FieldErrors = Record<string, string>;

export const EMPTY_WORKING_EQUITATION_FORM: WorkingEquitationFormData = {
  participant: {
    fullName: "",
    street: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
  },
  horse: {
    name: "",
    breed: "",
    sex: "",
    age: "",
    specialRequirements: "",
  },
  booking: {
    fridayAccommodation: "none",
    saturdayAccommodation: "none",
    saturdayCatering: false,
    saturdayBemer: false,
    sundayAccommodation: "none",
    sundayCatering: false,
    sundayBemer: false,
  },
  acknowledgements: {
    ownRisk: false,
    helmetDuty: false,
    liabilityLimitation: false,
    horseLiabilityInsurance: false,
    horseHealthy: false,
    participationTerms: false,
    cancellationTerms: false,
    dataProcessing: false,
  },
  photoChoice: "",
  typedParticipantName: "",
};

export const accommodationLabels: Record<Accommodation, string> = {
  none: "Keine Unterbringung",
  outdoor_box: "Außenbox",
  panel_box: "Panelbox",
  self_fenced_pasture: "Weidefläche zur Selbsteinzäunung",
};

const accommodationPrices: Record<Accommodation, number> = {
  none: 0,
  outdoor_box: 2_500,
  panel_box: 2_000,
  self_fenced_pasture: 1_500,
};

export function calculateWorkingEquitationBooking(
  booking: WorkingEquitationFormData["booking"],
): { items: BookingItem[]; totalCents: number } {
  const items: BookingItem[] = [
    {
      code: "base_course",
      label: "2-tägiger Kurs mit eigenem Pferd",
      amountCents: WORKING_EQUITATION_EVENT.basePriceCents,
    },
  ];

  const addAccommodation = (
    code: string,
    dateLabel: string,
    accommodation: Accommodation,
  ) => {
    if (accommodation === "none") return;
    items.push({
      code,
      label: `${dateLabel}: ${accommodationLabels[accommodation]}`,
      amountCents: accommodationPrices[accommodation],
    });
  };

  addAccommodation(
    "friday_accommodation",
    "Freitag, 18. September",
    booking.fridayAccommodation,
  );
  addAccommodation(
    "saturday_accommodation",
    "Samstag, 19. September",
    booking.saturdayAccommodation,
  );
  if (booking.saturdayCatering) {
    items.push({
      code: "saturday_catering",
      label: "Samstag, 19. September: Verpflegung",
      amountCents: 2_000,
    });
  }
  if (booking.saturdayBemer) {
    items.push({
      code: "saturday_bemer",
      label: "Samstag, 19. September: 15 Minuten BEMER",
      amountCents: 2_500,
    });
  }

  addAccommodation(
    "sunday_accommodation",
    "Sonntag, 20. September",
    booking.sundayAccommodation,
  );
  if (booking.sundayCatering) {
    items.push({
      code: "sunday_catering",
      label: "Sonntag, 20. September: Verpflegung",
      amountCents: 2_000,
    });
  }
  if (booking.sundayBemer) {
    items.push({
      code: "sunday_bemer",
      label: "Sonntag, 20. September: 15 Minuten BEMER",
      amountCents: 2_500,
    });
  }

  return {
    items,
    totalCents: items.reduce((total, item) => total + item.amountCents, 0),
  };
}

export function formatEuro(amountCents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);
}

function normalizedName(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("de-DE");
}

export function validateWorkingEquitationStep(
  step: number,
  data: WorkingEquitationFormData,
): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 0) {
    if (data.participant.fullName.trim().length < 2) {
      errors["participant.fullName"] =
        "Bitte geben Sie Ihren vollständigen Namen ein.";
    }
    if (data.participant.street.trim().length < 3) {
      errors["participant.street"] =
        "Bitte geben Sie Straße und Hausnummer ein.";
    }
    if (!/^\d{5}$/.test(data.participant.postalCode.trim())) {
      errors["participant.postalCode"] =
        "Bitte geben Sie eine fünfstellige Postleitzahl ein.";
    }
    if (data.participant.city.trim().length < 2) {
      errors["participant.city"] = "Bitte geben Sie Ihren Ort ein.";
    }
    if (!/^\+?[0-9][0-9 ()/.-]{5,}$/.test(data.participant.phone.trim())) {
      errors["participant.phone"] =
        "Bitte geben Sie eine gültige Telefonnummer ein.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.participant.email.trim())) {
      errors["participant.email"] =
        "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    }
  }

  if (step === 1) {
    if (data.horse.name.trim().length < 1) {
      errors["horse.name"] = "Bitte geben Sie den Namen des Pferdes ein.";
    }
    if (data.horse.breed.trim().length < 1) {
      errors["horse.breed"] = "Bitte geben Sie die Rasse ein.";
    }
    if (data.horse.sex.trim().length < 1) {
      errors["horse.sex"] = "Bitte geben Sie das Geschlecht ein.";
    }
    const age = Number(data.horse.age);
    if (!Number.isInteger(age) || age < 1 || age > 40) {
      errors["horse.age"] =
        "Bitte geben Sie ein Alter zwischen 1 und 40 Jahren ein.";
    }
  }

  if (step === 3) {
    const acknowledgements = data.acknowledgements;
    const acknowledgementFields: Array<
      [keyof typeof acknowledgements, string]
    > = [
      ["ownRisk", "Bitte bestätigen Sie die Teilnahme auf eigene Gefahr."],
      ["helmetDuty", "Bitte bestätigen Sie die Helmpflicht."],
      [
        "liabilityLimitation",
        "Bitte bestätigen Sie die Haftungsbeschränkung.",
      ],
      [
        "horseLiabilityInsurance",
        "Bitte bestätigen Sie die Pferdehaftpflichtversicherung.",
      ],
      [
        "horseHealthy",
        "Bitte bestätigen Sie den Gesundheitszustand des Pferdes.",
      ],
      [
        "participationTerms",
        "Bitte erkennen Sie die Teilnahmebedingungen an.",
      ],
      [
        "cancellationTerms",
        "Bitte akzeptieren Sie die Stornierungsbedingungen.",
      ],
      [
        "dataProcessing",
        "Die Einwilligung zur Datenverarbeitung ist erforderlich.",
      ],
    ];
    for (const [field, message] of acknowledgementFields) {
      if (!acknowledgements[field]) {
        errors[`acknowledgements.${field}`] = message;
      }
    }
    if (!data.photoChoice) {
      errors.photoChoice =
        "Bitte wählen Sie ausdrücklich aus, ob Sie einwilligen oder nicht.";
    }
    if (
      normalizedName(data.typedParticipantName) !==
      normalizedName(data.participant.fullName)
    ) {
      errors.typedParticipantName =
        "Der eingegebene Name muss mit dem Teilnehmernamen übereinstimmen.";
    }
  }

  return errors;
}

export function validateWorkingEquitationForm(
  data: WorkingEquitationFormData,
): FieldErrors {
  return [0, 1, 3].reduce(
    (errors, step) => ({
      ...errors,
      ...validateWorkingEquitationStep(step, data),
    }),
    {},
  );
}

export function createWorkingEquitationSubmission(
  data: WorkingEquitationFormData,
  idempotencyKey: string,
  formStartedAt: number,
): RegistrationSubmissionPayload {
  return {
    eventId: WORKING_EQUITATION_EVENT_ID,
    idempotencyKey,
    formStartedAt,
    website: "",
    participant: { ...data.participant },
    horse: { ...data.horse },
    booking: { ...data.booking },
    acknowledgements: { ...data.acknowledgements },
    photoChoice: data.photoChoice,
    typedParticipantName: data.typedParticipantName,
  };
}
