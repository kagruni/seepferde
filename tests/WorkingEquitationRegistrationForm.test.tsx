import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WorkingEquitationRegistrationForm from "../src/components/events/WorkingEquitationRegistrationForm";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("WorkingEquitationRegistrationForm", () => {
  it("validates each step, reviews the complete booking, and submits once", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        duplicate: false,
        reference: "WE-20260919-ABC12345",
        totalCents: 51_000,
        acknowledgedAt: "2026-07-24T12:00:00+00:00",
        confirmationEmailSent: true,
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<WorkingEquitationRegistrationForm />);

    await user.click(screen.getByRole("button", { name: "Weiter" }));
    expect(
      screen.getByText("Bitte geben Sie Ihren vollständigen Namen ein."),
    ).toBeTruthy();
    await waitFor(() =>
      expect(document.activeElement?.id).toBe("we-full-name"),
    );

    await user.type(
      screen.getByLabelText("Vor- und Nachname *"),
      "Clara Beispiel",
    );
    await user.type(
      screen.getByLabelText("Straße und Hausnummer *"),
      "Hafenstraße 20",
    );
    await user.type(screen.getByLabelText("Postleitzahl *"), "04442");
    await user.type(screen.getByLabelText("Ort *"), "Zwenkau");
    await user.type(
      screen.getByLabelText("Telefon *"),
      "+49 177 1234567",
    );
    await user.type(
      screen.getByLabelText("E-Mail *"),
      "clara@example.de",
    );
    await user.click(screen.getByRole("button", { name: "Weiter" }));

    await user.type(screen.getByLabelText("Name des Pferdes *"), "Luna");
    await user.type(screen.getByLabelText("Rasse *"), "Haflinger");
    await user.type(screen.getByLabelText("Geschlecht *"), "Stute");
    await user.type(screen.getByLabelText("Alter in Jahren *"), "11");
    await user.type(
      screen.getByLabelText(
        "Besonderheiten oder besondere Anforderungen (optional)",
      ),
      "Benötigt Heu am Abend.",
    );
    await user.click(screen.getByRole("button", { name: "Weiter" }));

    const friday = screen.getByRole("group", {
      name: "Anreise am Freitag, 18. September 2026",
    });
    await user.click(within(friday).getByLabelText(/Außenbox/));

    const saturday = screen.getByRole("group", {
      name: "Samstag, 19. September 2026",
    });
    await user.click(within(saturday).getByLabelText(/Panelbox/));
    await user.click(
      screen.getAllByLabelText(
        /Verpflegung \(Getränke, Snacks und Mittagessen\)/,
      )[0],
    );
    await user.click(
      screen.getAllByLabelText(/15-minütige BEMER-Anwendung/)[1],
    );
    expect(screen.getAllByText("510,00 €").length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "Weiter" }));

    const participationConditions = screen.getByRole("region", {
      name: "Teilnahmebedingungen",
    });
    expect(
      within(participationConditions).getAllByRole("checkbox"),
    ).toHaveLength(1);
    expect(
      within(participationConditions).queryByText(
        "Ich erkenne diese Teilnahmebedingungen an.",
      ),
    ).toBeNull();
    expect(
      within(participationConditions).getByLabelText(
        "Ich habe alle oben aufgeführten Teilnahmebedingungen gelesen und akzeptiere sie.",
      ),
    ).toBeTruthy();
    expect(
      within(participationConditions).queryByText(/gemeinsam/i),
    ).toBeNull();

    for (const checkbox of screen.getAllByRole("checkbox")) {
      await user.click(checkbox);
    }
    await user.click(
      screen.getByLabelText(
        /Ich bin nicht damit einverstanden, dass Foto- und Videoaufnahmen/,
      ),
    );
    await user.type(
      screen.getByLabelText("Digitale Bestätigung: Vor- und Nachname *"),
      "Clara Beispiel",
    );
    await user.click(screen.getByRole("button", { name: "Weiter" }));

    expect(screen.getByText("Clara Beispiel")).toBeTruthy();
    expect(screen.getByText("Benötigt Heu am Abend.")).toBeTruthy();
    expect(screen.getByText("Foto / Video: Keine Einwilligung")).toBeTruthy();
    expect(screen.getAllByText("510,00 €").length).toBeGreaterThan(0);

    await user.click(
      screen.getByRole("button", { name: "Verbindlich anmelden" }),
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const request = fetchMock.mock.calls[0][1] as RequestInit;
    const payload = JSON.parse(String(request.body));
    expect(payload.eventId).toBe(
      "working-equitation-manuel-heindl-september-2026",
    );
    expect(payload.participant.fullName).toBe("Clara Beispiel");
    expect(payload.horse.specialRequirements).toBe(
      "Benötigt Heu am Abend.",
    );
    expect(payload.acknowledgements).toMatchObject({
      ownRisk: true,
      helmetDuty: true,
      liabilityLimitation: true,
      horseLiabilityInsurance: true,
      horseHealthy: true,
      participationTerms: true,
    });
    expect(payload.acknowledgements.cancellationTerms).toBe(true);
    expect(payload.photoChoice).toBe("decline");
    expect(payload).not.toHaveProperty("totalCents");

    expect(
      await screen.findByRole("heading", { name: "Anmeldung angenommen" }),
    ).toBeTruthy();
    expect(screen.getByText("WE-20260919-ABC12345")).toBeTruthy();
    expect(
      screen.getByText("DE03 8605 5592 1090 2121 58"),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Working Equitation + Clara Beispiel + 19.-20.09.2026",
      ),
    ).toBeTruthy();
  });
});
