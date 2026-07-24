import assert from "node:assert/strict";
import test from "node:test";
import {
  EMPTY_WORKING_EQUITATION_FORM,
  WORKING_EQUITATION_EVENT_ID,
  calculateWorkingEquitationBooking,
  createWorkingEquitationSubmission,
  validateWorkingEquitationForm,
  validateWorkingEquitationStep,
  type WorkingEquitationFormData,
} from "../src/lib/working-equitation-registration";

function validForm(): WorkingEquitationFormData {
  return {
    participant: {
      fullName: "Clara Beispiel",
      street: "Hafenstraße 20",
      postalCode: "04442",
      city: "Zwenkau",
      phone: "+49 177 1234567",
      email: "clara@example.de",
    },
    horse: {
      name: "Luna",
      breed: "Haflinger",
      sex: "Stute",
      age: "11",
      specialRequirements: "Benötigt Heu am Abend.",
    },
    booking: {
      fridayAccommodation: "outdoor_box",
      saturdayAccommodation: "panel_box",
      saturdayCatering: true,
      saturdayBemer: false,
      sundayAccommodation: "self_fenced_pasture",
      sundayCatering: false,
      sundayBemer: true,
    },
    acknowledgements: {
      ownRisk: true,
      helmetDuty: true,
      liabilityLimitation: true,
      horseLiabilityInsurance: true,
      horseHealthy: true,
      participationTerms: true,
      cancellationTerms: true,
      dataProcessing: true,
    },
    photoChoice: "decline",
    typedParticipantName: "Clara Beispiel",
  };
}

test("calculates the fixed base booking without optional services", () => {
  const result = calculateWorkingEquitationBooking(
    EMPTY_WORKING_EQUITATION_FORM.booking,
  );

  assert.equal(result.totalCents, 42_000);
  assert.deepEqual(result.items.map((item) => item.code), ["base_course"]);
});

test("calculates every accommodation and day option once", () => {
  const result = calculateWorkingEquitationBooking({
    fridayAccommodation: "outdoor_box",
    saturdayAccommodation: "outdoor_box",
    saturdayCatering: true,
    saturdayBemer: true,
    sundayAccommodation: "outdoor_box",
    sundayCatering: true,
    sundayBemer: true,
  });

  assert.equal(result.totalCents, 58_500);
  assert.deepEqual(result.items.map((item) => item.amountCents), [
    42_000, 2_500, 2_500, 2_000, 2_500, 2_500, 2_000, 2_500,
  ]);
});

test("keeps accommodation choices mutually exclusive by data shape", () => {
  const result = calculateWorkingEquitationBooking({
    ...EMPTY_WORKING_EQUITATION_FORM.booking,
    saturdayAccommodation: "panel_box",
  });

  assert.equal(result.totalCents, 44_000);
  assert.equal(
    result.items.filter((item) => item.code === "saturday_accommodation")
      .length,
    1,
  );
});

test("validates each required participant and horse field per step", () => {
  const emptyParticipantErrors = validateWorkingEquitationStep(
    0,
    EMPTY_WORKING_EQUITATION_FORM,
  );
  assert.deepEqual(Object.keys(emptyParticipantErrors), [
    "participant.fullName",
    "participant.street",
    "participant.postalCode",
    "participant.city",
    "participant.phone",
    "participant.email",
  ]);

  const emptyHorseErrors = validateWorkingEquitationStep(
    1,
    EMPTY_WORKING_EQUITATION_FORM,
  );
  assert.deepEqual(Object.keys(emptyHorseErrors), [
    "horse.name",
    "horse.breed",
    "horse.sex",
    "horse.age",
  ]);
});

test("requires every acknowledgement, an explicit photo choice, and matching typed name", () => {
  const form = validForm();
  form.acknowledgements.helmetDuty = false;
  form.acknowledgements.dataProcessing = false;
  form.photoChoice = "";
  form.typedParticipantName = "Andere Person";

  const errors = validateWorkingEquitationForm(form);
  assert.ok(errors["acknowledgements.helmetDuty"]);
  assert.ok(errors["acknowledgements.dataProcessing"]);
  assert.ok(errors.photoChoice);
  assert.ok(errors.typedParticipantName);
});

test("builds a complete submission without a client-controlled total", () => {
  const payload = createWorkingEquitationSubmission(
    validForm(),
    "11111111-1111-4111-8111-111111111111",
    1_800_000_000_000,
  );

  assert.equal(payload.eventId, WORKING_EQUITATION_EVENT_ID);
  assert.equal(payload.participant.fullName, "Clara Beispiel");
  assert.equal(payload.horse.name, "Luna");
  assert.equal(payload.acknowledgements.cancellationTerms, true);
  assert.equal(payload.photoChoice, "decline");
  assert.equal("totalCents" in payload, false);
  assert.equal("items" in payload, false);
});
