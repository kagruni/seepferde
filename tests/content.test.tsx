// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import {
  clearContentCache,
  getFeaturedUpcomingEvent,
  getPastEvents,
  validateAllContent,
} from "../src/lib/content";
import * as dates from "../src/lib/content/dates";

const eventSlug = "working-equitation-manuel-heindl-september-2026";

afterEach(() => {
  vi.restoreAllMocks();
  clearContentCache();
});

it.each([
  ["2026-09-20", false],
  ["2026-09-21", true],
] as const)(
  "validates content and selects events correctly on %s",
  (today, expired) => {
    vi.spyOn(dates, "getBerlinCalendarDate").mockReturnValue(today);

    expect(() => validateAllContent({ validateAdmin: true })).not.toThrow();
    expect(getFeaturedUpcomingEvent()?.slug).toBe(
      expired ? undefined : eventSlug,
    );
    expect(getPastEvents().some((event) => event.slug === eventSlug)).toBe(expired);
  },
);
