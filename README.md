# MediCore — Smart Hospital Management System

MediCore is a full-stack **operational hospital management platform**: patient
registration, appointment and queue management, doctor consultation
workflows, electronic medical records, pharmacy and prescription tracking,
billing, and role-scoped analytics — all in one bilingual (English /
Bahasa Indonesia) product.

> **This is not a medical diagnosis tool.** MediCore does not provide
> clinical decision support, diagnostic suggestions, or medical advice. It
> is operational software for hospital/clinic staff to run their day-to-day
> workflows — every clinical judgment remains the responsibility of the
> attending doctor or nurse.

---

## Features

- **Patient registration & records** — medical record numbers, blood type,
  allergies, emergency contacts.
- **Appointments & queueing** — automatic queue-number allocation per doctor
  per day, check-in, reschedule, cancel, no-show.
- **Doctor consultation workspace** — a three-column workflow: patient
  history on the left, the medical record form in the center, vital signs
  and prescriptions on the right. Finalized records become read-only.
- **Nurse workspace** — checked-in queue, vital signs capture, shared
  nurse/doctor notes on in-progress records.
- **Pharmacy** — prescription lifecycle (pending → prepared → dispensed),
  atomic stock deduction with an insufficient-stock guard, medicine catalog
  CRUD, low-stock/expiry alerts.
- **Billing** — invoice generation from a completed appointment
  (consultation fee + dispensed medicines), partial/full payment
  processing, automatic invoice-status recalculation, printable receipts.
- **Patient portal** — self-service view of appointments, medical history,
  prescriptions, and invoices, strictly scoped to the signed-in patient.
- **Admin console** — user/department/doctor management, hospital-wide
  patient and appointment views, an activity-log audit trail, and an
  analytics/reports screen with charts and a date-range filter.
- **Bilingual UI** — every screen, status label, and form is available in
  English and Bahasa Indonesia, switchable at any time, persisted per device.
- **XLSX exports** — patients, appointments, prescriptions, medicine
  inventory, and invoices/payments, each scoped to what the exporting
  role can already see.
- **Role-based access control** — 7 roles, each with its own dashboard,
  navigation, and Server Action guards — never just a hidden UI element.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router). Note: Next 16 renamed Middleware to **Proxy** (`proxy.ts`, not `middleware.ts`) |
| UI | React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Base UI primitives) |
| Data | PostgreSQL via [Neon](https://neon.tech), Prisma 7 (engine-less — requires a driver adapter, `@prisma/adapter-pg`) |
| Auth | NextAuth (Auth.js) v4, credentials provider, JWT sessions |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table |
| Charts | Recharts (via a shared shadcn chart wrapper) |
| Exports | `xlsx` |
| Dates | `date-fns` (with locale-aware formatting) |

## Role matrix

| Role | Can do |
|---|---|
| **Admin** | Everything: manage users, departments, doctors; view all patients, appointments, and medical data; manage medicines; view prescriptions/invoices; full analytics and activity logs |
| **Doctor** | Own today's appointments; start/complete consultations; create/finalize medical records; view assigned patient history; write prescriptions |
| **Nurse** | View checked-in queue; record vital signs; add nurse notes to in-progress records |
| **Receptionist** | Register patients; create/reschedule/cancel appointments; manage the check-in queue; view doctor availability |
| **Pharmacist** | View pending prescriptions; prepare/dispense; manage medicine inventory; low-stock/expiry alerts |
| **Cashier** | View unpaid invoices; generate invoices; process payments; daily revenue report |
| **Patient** | View only their own appointments, medical history summary, prescriptions, invoices, and profile |

Access is enforced in three layers: `proxy.ts` (optimistic, JWT-based route
redirection), every Server Action (`requireRole(...)` at the top of the
function), and every query (patient-portal queries always resolve data from
the session's own patient/doctor id — never a client-supplied id).

## Data model (ERD summary)

15 models across five domains, connected by the patient/appointment
lifecycle:

```
User ──┬─ Patient (optional 1:1, for portal login)
        ├─ Doctor (1:1)
        └─ ActivityLog, and "actor" FKs on Appointment/VitalSign/Prescription/Payment

Department ─┬─ Doctor ─┬─ DoctorSchedule
             └─ Appointment

Patient ─┬─ Appointment ─┬─ MedicalRecord (1:1)
         │               ├─ VitalSign
         │               ├─ Prescription ─── PrescriptionItem ─── Medicine
         │               └─ Invoice ─┬─ InvoiceItem
         │                           └─ Payment
         └─ MedicalRecord, VitalSign, Prescription, Invoice (direct FKs for fast own-data queries)
```

Key constraints: one queue number per doctor per calendar day
(`@@unique([doctorId, appointmentDate, queueNumber])`), one medical record
per appointment, medicine stock only decreases when a prescription
transitions to `DISPENSED` (enforced in a transaction with a pre-check, not
a database trigger), and finalized medical records are immutable in
application logic (never hard-deleted — `MedicalRecordStatus.ARCHIVED`
exists for soft retirement).

See `prisma/schema.prisma` for the full schema with every field, enum, and
index.

## Business workflows

1. **Registration** — reception creates a `Patient` with an auto-generated
   medical record number; optionally linked to a `User` for portal access.
2. **Appointment & queue** — reception books an appointment (queue number
   auto-assigned per doctor/day) → patient checks in → doctor starts
   consultation → doctor completes it.
3. **Consultation & EMR** — the doctor's workspace saves a `DRAFT` medical
   record, optionally finalizes it (locking further edits), and can create
   a prescription against the current record.
4. **Prescription & pharmacy** — `PENDING` → pharmacist prepares
   (`PREPARED`) → pharmacist dispenses (`DISPENSED`, which decrements
   medicine stock inside a transaction and is blocked if any line item's
   stock is insufficient).
5. **Billing** — cashier generates an invoice from a completed appointment
   (consultation fee + dispensed medicines), then records payments;
   `InvoiceStatus` (`UNPAID` → `PARTIALLY_PAID` → `PAID`) is derived from
   `paidAmount` vs. `totalAmount`, never set by hand.

## Bilingual (i18n) implementation

A lightweight, dependency-free dictionary system (no `next-intl` or
similar): `lib/i18n/dictionaries/{en,id}.ts` are plain nested objects;
`lib/i18n/dictionary.ts` resolves a dot-path key against the active locale,
falling back to English, then to the raw key, so a missing translation
never crashes the UI. `I18nProvider` (`lib/i18n/i18n-provider.tsx`) uses
`useSyncExternalStore` against `localStorage` (not `useState` +
`useEffect`, to avoid a React-recommended-against setState-in-effect
pattern) so the selected language persists across reloads. `useI18n()`
exposes `{ locale, setLocale, t }` to any client component.
`lib/i18n/formatters.ts` wraps `date-fns` and `Intl.NumberFormat` for
locale-aware dates and currency (amounts are always IDR — this is an
Indonesian hospital — but grouping/format follow the selected locale).
Database enum values are never translated, only their displayed labels
(see `components/status-badge.tsx` and `lib/domain/status-labels.ts` for
the server-side/export equivalent).

## Demo accounts

All demo accounts share the password **`Password123!`**

| Role | Email |
|---|---|
| Admin | `admin@medicore.demo` |
| Doctor | `doctor@medicore.demo` |
| Nurse | `nurse@medicore.demo` |
| Receptionist | `receptionist@medicore.demo` |
| Pharmacist | `pharmacist@medicore.demo` |
| Cashier | `cashier@medicore.demo` |
| Patient | `patient@medicore.demo` |

The login page has a one-click demo account selector that fills in these
credentials for you. `patient@medicore.demo` (Michael Tanuwijaya) is
seeded with a real history: a finalized visit with a dispensed
prescription and a paid invoice, plus one upcoming appointment, so the
patient portal isn't empty on first login.

## Setup guide

```bash
git clone https://github.com/xebec51/medicore-hospital-management-system.git
cd medicore-hospital-management-system
npm install

# Copy the example env and fill in real values (see below)
cp .env.example .env   # if present, otherwise create .env manually

npx prisma validate
npx prisma migrate dev --name init   # only if the database is empty
npm run seed

npm run dev
```

Open http://localhost:3000 and sign in with any demo account above.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon). Read by `prisma.config.ts` for CLI commands and by the `@prisma/adapter-pg` driver adapter at runtime — Prisma 7 has no built-in engine, so the app cannot start without this. |
| `NEXTAUTH_URL` | Canonical app URL NextAuth uses for callbacks (e.g. `http://localhost:3000` locally). |
| `NEXT_PUBLIC_APP_URL` | Public-facing app URL, exposed to the client. |
| `NEXTAUTH_SECRET` / `AUTH_SECRET` | Secret used to sign/encrypt session JWTs (both are read; either satisfies `lib/auth/auth-options.ts`). |

Never commit `.env` — it's already covered by `.gitignore`.

## Migration & seed guide

- Schema lives in `prisma/schema.prisma`; migrations in `prisma/migrations/`.
- `npx prisma migrate dev --name <name>` creates a new migration against a
  local/dev database.
- `npm run seed` (`prisma/seed.ts`) **wipes and reseeds** every table (in
  FK-safe order) with: 7 demo users + 4 additional doctors, 8 departments,
  5 doctors with weekly schedules, 22 patients, 24 medicines (including
  low-stock and expired examples), and a fully connected web of
  appointments/medical records/vital signs/prescriptions/invoices/payments
  that exercises every enum status value. Safe to re-run any time you want
  a clean demo state.

## Deployment (Vercel + Neon)

1. Create a Neon Postgres project and copy its pooled connection string
   into `DATABASE_URL`.
2. Push this repo to GitHub and import it into Vercel.
3. Set the environment variables above in the Vercel project settings
   (production values, e.g. `NEXTAUTH_URL=https://<your-app>.vercel.app`).
4. Vercel runs `npm run build`, which runs `prisma generate && next build`;
   `postinstall` also runs `prisma generate` so the client is always in
   sync with `prisma/schema.prisma`.
5. Run `npx prisma migrate deploy` (via Vercel's build command or a one-off
   local run against the production `DATABASE_URL`) before the first
   deploy, then `npm run seed` if you want demo data in production.

## Screenshots

_Add screenshots of the landing page, login, admin dashboard, consultation
workspace, and pharmacist queue here before publishing._

## Known limitations

- No patient self-service appointment booking (registration and booking
  are receptionist/admin-driven, per spec — the schema and RBAC would
  support adding it later).
- No real payment gateway integration; payments are recorded as already
  completed (cash/transfer/e-wallet/insurance), not processed through a
  provider.
- No automated test suite (unit/e2e) yet — verification for this build
  was done via `next build`'s type-checking plus targeted, hand-written
  end-to-end checks against the real database for every mutating
  workflow (documented in the commit history).
- Single currency (IDR) and single hospital/tenant — no multi-branch or
  multi-currency support.
- No SMS/email/push notifications for appointment reminders.
- Reporting is limited to the metrics implemented (status distribution,
  department workload, revenue trend); no custom report builder.

## Future improvements

- Patient-initiated appointment requests with receptionist approval.
- Real payment gateway integration (Midtrans/Xendit are common in
  Indonesia).
- Automated test coverage (Vitest/Playwright).
- Notification system (email/SMS/WhatsApp) for appointment reminders and
  low-stock/expiry alerts.
- Multi-branch/multi-tenant support.

---

Built as a full-stack portfolio project. Not affiliated with any real
hospital; all data is synthetic demo data.
