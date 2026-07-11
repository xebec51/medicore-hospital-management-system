/**
 * Callers are expected to construct appointment/schedule Date values at UTC
 * midnight for the intended calendar day, so day-boundary math here can stay
 * plain UTC instead of pulling in a timezone library for a single-country app.
 */

export function startOfDayUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}

export function endOfDayUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
}

export function calculateAge(birthDate: Date, atDate: Date = new Date()): number {
  let age = atDate.getUTCFullYear() - birthDate.getUTCFullYear();
  const monthDiff = atDate.getUTCMonth() - birthDate.getUTCMonth();
  const dayDiff = atDate.getUTCDate() - birthDate.getUTCDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
  return age;
}

/** Combines a calendar day with an "HH:mm" time string into a single UTC Date. */
export function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const combined = startOfDayUTC(date);
  combined.setUTCHours(hours, minutes, 0, 0);
  return combined;
}
