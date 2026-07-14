export const CONTENT_TIME_ZONE = "Europe/Berlin";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export function isCalendarDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isLocalTime(value: string): boolean {
  return TIME_PATTERN.test(value);
}

export function normalizeCalendarDate(value: unknown): unknown {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return value;
}

export function getBerlinCalendarDate(referenceDate = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CONTENT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(referenceDate);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;

  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function getBerlinYear(referenceDate = new Date()): number {
  return Number(getBerlinCalendarDate(referenceDate).slice(0, 4));
}

export function getEffectiveEndDate(event: {
  date: string;
  endDate?: string;
}): string {
  return event.endDate ?? event.date;
}

export function getEventChronology(
  event: { date: string; endDate?: string },
  today = getBerlinCalendarDate()
): "upcoming" | "past" {
  return getEffectiveEndDate(event) < today ? "past" : "upcoming";
}

export function calculateAgeFromBirthYear(
  birthYear: number,
  referenceDate = new Date()
): number {
  return Math.max(0, getBerlinYear(referenceDate) - birthYear);
}

export function isWithinDateWindow(
  item: { startDate?: string; endDate?: string },
  today = getBerlinCalendarDate()
): boolean {
  if (item.startDate && item.startDate > today) return false;
  if (item.endDate && item.endDate < today) return false;
  return true;
}
