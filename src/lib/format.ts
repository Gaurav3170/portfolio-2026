import type { CareerDate } from "@/types/career";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(date: CareerDate): string {
  return `${MONTHS[date.month - 1]} ${date.year}`;
}

export function formatRange(start: CareerDate, end: CareerDate | null): string {
  return `${formatDate(start)} – ${end ? formatDate(end) : "Present"}`;
}

/** "2026-10-18" → "18 Oct 2026". */
export function formatPostDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** Machine-readable value for <time dateTime>. */
export function toDateTime(date: CareerDate): string {
  return `${date.year}-${String(date.month).padStart(2, "0")}`;
}
