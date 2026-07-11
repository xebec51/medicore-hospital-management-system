import { randomBytes } from "node:crypto";

// Excludes visually ambiguous characters (0/O, 1/I) so printed codes stay readable.
const SAFE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSuffix(length: number): string {
  const bytes = randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += SAFE_ALPHABET[bytes[i] % SAFE_ALPHABET.length];
  }
  return result;
}

function datePart(date: Date = new Date()): string {
  const yy = String(date.getUTCFullYear()).slice(-2);
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

function buildCode(prefix: string, options?: { withDate?: boolean; suffixLength?: number }): string {
  const { withDate = true, suffixLength = 5 } = options ?? {};
  const parts = [prefix];
  if (withDate) parts.push(datePart());
  parts.push(randomSuffix(suffixLength));
  return parts.join("-");
}

export function generateAppointmentCode(): string {
  return buildCode("APT");
}

export function generateMedicalRecordNumber(): string {
  return buildCode("MRN");
}

export function generateInvoiceCode(): string {
  return buildCode("INV");
}

export function generatePaymentCode(): string {
  return buildCode("PAY");
}

export function generatePrescriptionCode(): string {
  return buildCode("RX");
}

export function generateMedicineCode(): string {
  return buildCode("MED", { withDate: false, suffixLength: 6 });
}
