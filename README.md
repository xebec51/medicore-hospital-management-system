# MediCore

<p align="center">
  <img src="https://img.shields.io/badge/Smart-Hospital%20Management%20System-111827?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Live%20Portfolio%20Project-16A34A?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-2563EB?style=for-the-badge" />
</p>

<p align="center">
  <a href="https://medicore-hospital-management-system.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Open%20on%20Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
  <a href="https://github.com/xebec51/medicore-hospital-management-system">
    <img src="https://img.shields.io/badge/Repository-View%20Source-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
</p>

<p align="center">
  <strong>Operational hospital management platform for patient registration, appointment and queue management, consultation and EMR, pharmacy, billing, and role-scoped analytics.</strong>
</p>

<p align="center">
  MediCore combines a bilingual clinical operations UI with role-based dashboards for admins, doctors, nurses, receptionists, pharmacists, cashiers, and patients in one cohesive product flow.
</p>

<p align="center">
  <a href="https://medicore-hospital-management-system.vercel.app/"><strong>Live Demo</strong></a>
  |
  <a href="#demo-accounts"><strong>Demo Accounts</strong></a>
  |
  <a href="#setup"><strong>Setup Guide</strong></a>
  |
  <a href="#features"><strong>Features</strong></a>
</p>

> **This is not a medical diagnosis tool.** MediCore does not provide clinical
> decision support, diagnostic suggestions, or medical advice. It is
> operational software for hospital/clinic staff to run their day-to-day
> workflows — every clinical judgment remains the responsibility of the
> attending doctor or nurse.

---

## Overview

MediCore is a smart hospital management platform designed to handle both the
day-to-day front-desk experience and the operational complexity behind
consultations, prescriptions, dispensing, billing, and reporting.

It is built as a portfolio-grade SaaS-style application with realistic
business rules, role-aware access control, and deployable production
behavior.

Core product focus:

- patient registration and appointment/queue management
- doctor consultation workflow and electronic medical records
- nurse vital-sign capture and shared clinical notes
- prescription lifecycle and pharmacy stock management
- invoice generation and payment processing
- role-scoped analytics and XLSX exports

---

## Live Demo

- Deployment: `https://medicore-hospital-management-system.vercel.app/`
- Platform: Vercel
- Database: Neon PostgreSQL

---

## Portfolio Context

This project is part of a full-stack portfolio focused on building
production-ready SaaS applications with modern web technologies, role-based
access control, database-backed workflows, analytics, and polished UI/UX.

---

## Highlights

- Bilingual English and Bahasa Indonesia UI with persisted language switching
- Admin, doctor, nurse, receptionist, pharmacist, cashier, and patient
  workflows inside one unified platform
- Queue-driven appointment lifecycle with automatic per-doctor daily queue
  numbers
- A three-column doctor consultation workspace with a clinical
  appointment-status stepper
- Prescription-to-pharmacy lifecycle with atomic, insufficient-stock-guarded
  dispensing
- Invoice and payment workflow with automatically derived invoice status
- XLSX export support for operational reporting
- Prisma + PostgreSQL data model designed around a real patient/appointment
  lifecycle
- An in-app "Developer Details" page (`/dashboard/developer`), reachable from
  every role's dashboard, with project and contact information

---

## Features

### Public Experience

- landing page introducing MediCore's workflow and role coverage
- credentials-based login with a one-click demo account selector
- language switcher (English / Bahasa Indonesia), persisted per device

### Authentication & Access Control

- credentials-based authentication with NextAuth/Auth.js, JWT sessions
- role-aware dashboard redirects
- protected dashboard routes through `proxy.ts` (Next.js 16's renamed
  Middleware)
- three-layer RBAC: route redirection, `requireRole()` in every Server
  Action, and own-data query scoping (patient/doctor id always resolved from
  the session, never from client input)

### Admin Workspace

- manage users, departments, and doctors (with weekly schedules)
- oversee hospital-wide patients and appointments
- inspect an activity-log audit trail
- analytics and reports with charts, a date-range filter, and XLSX export

### Doctor Workspace

- today's appointment queue and assigned patient history
- a three-column consultation workspace: patient history, medical record
  form, vital signs and prescriptions
- save draft or finalize medical records (finalized records become
  read-only)
- write prescriptions against the current consultation

### Nurse Workspace

- checked-in patient queue
- vital-sign capture (temperature, blood pressure, pulse, weight, height)
- shared nurse/doctor notes on in-progress medical records

### Receptionist Workspace

- register patients with auto-generated medical record numbers
- create, reschedule, and cancel appointments
- manage the check-in queue and view doctor availability/schedules

### Pharmacist Workspace

- review pending prescriptions and prepare/dispense them
- medicine catalog CRUD with stock adjustment
- low-stock and expiry alerts

### Cashier Workspace

- generate invoices from completed appointments
- process partial/full payments across multiple methods
- printable invoice receipts and a daily revenue report

### Patient Portal

- view own appointments, medical history, prescriptions, and invoices
- profile management
- strictly scoped to the signed-in patient's own data

---

## Roles

### ADMIN

- platform-wide oversight and configuration
- user, department, and doctor management
- hospital-wide patient/appointment visibility
- activity-log auditing and full analytics

### DOCTOR

- own today's appointments and assigned patient history
- start/complete consultations
- create and finalize medical records
- write prescriptions

### NURSE

- view the checked-in queue
- record vital signs
- add nurse notes to in-progress medical records

### RECEPTIONIST

- register patients
- create/reschedule/cancel appointments
- manage the check-in queue and doctor availability

### PHARMACIST

- view pending prescriptions, prepare and dispense them
- manage medicine inventory
- low-stock/expiry alerts

### CASHIER

- view unpaid invoices and generate new ones
- process payments
- daily revenue reporting

### PATIENT

- view only their own appointments, medical history, prescriptions, and
  invoices

---

## Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-16.2.10-000000?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-7.8-2D3748?style=flat-square&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/NextAuth-Auth.js-4B5563?style=flat-square" />
  <img src="https://img.shields.io/badge/Zod-Validation-3B82F6?style=flat-square" />
  <img src="https://img.shields.io/badge/Recharts-Analytics-E11D48?style=flat-square" />
  <img src="https://img.shields.io/badge/XLSX-Export-15803D?style=flat-square" />
</p>

- Next.js 16.2.10 App Router (Middleware renamed to **Proxy** — `proxy.ts`)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Base UI primitives)
- Prisma 7.8.0 (engine-less — requires the `@prisma/adapter-pg` driver
  adapter)
- PostgreSQL on Neon
- NextAuth/Auth.js (credentials provider, JWT sessions)
- Zod
- React Hook Form
- Recharts
- TanStack Table
- xlsx
- date-fns
- bcryptjs

---

## Core Business Rules

### Registration

- reception creates a `Patient` with an auto-generated medical record number
- a patient may optionally be linked to a `User` for portal login

### Appointment & Queue

- reception books an appointment; the queue number is auto-assigned per
  doctor per calendar day (`@@unique([doctorId, appointmentDate,
  queueNumber])`)
- the patient checks in, the doctor starts the consultation, then completes
  it
- once an appointment is checked in, it can no longer be rescheduled

### Consultation & EMR

- the doctor's workspace saves a `DRAFT` medical record and can finalize it
  to `FINALIZED`, which locks further edits
- finalized records are never hard-deleted — `MedicalRecordStatus.ARCHIVED`
  exists for soft retirement
- a prescription can be created against the current medical record

### Prescription & Pharmacy

- `PENDING` → pharmacist prepares (`PREPARED`) → pharmacist dispenses
  (`DISPENSED`)
- dispensing decrements medicine stock inside a transaction and is blocked
  if any line item's stock is insufficient

### Billing

- the cashier generates an invoice from a completed appointment
  (consultation fee + dispensed medicines), then records payments
- `InvoiceStatus` (`UNPAID` → `PARTIALLY_PAID` → `PAID`) is derived from
  `paidAmount` vs. `totalAmount`, never set by hand

---

## Database Summary

Implemented Prisma models:

- `User`
- `Department`
- `Doctor`
- `DoctorSchedule`
- `Patient`
- `Appointment`
- `MedicalRecord`
- `VitalSign`
- `Prescription`
- `PrescriptionItem`
- `Medicine`
- `Invoice`
- `InvoiceItem`
- `Payment`
- `ActivityLog`

Key relationships:

- `doctors.department_id` references `departments.id`, and
  `doctor_schedules.doctor_id` references `doctors.id`
- `appointments` belong to a `patient` and a `doctor`, with a named
  `AppointmentCreatedBy` actor relation back to `User`
- `medical_records`, `vital_signs`, `prescriptions`, and `invoices` all carry
  a direct `appointment_id` and `patient_id` for fast own-data queries
- `prescription_items` belong to `prescriptions` and `medicines`
- `invoice_items` belong to `invoices`; `payments` belong to `invoices` with
  a named `PaymentProcessedBy` actor relation

Key constraints: one queue number per doctor per calendar day, one medical
record per appointment, medicine stock only decreases when a prescription
transitions to `DISPENSED` (enforced in a transaction with a pre-check, not
a database trigger), and finalized medical records are immutable in
application logic.

See `prisma/schema.prisma` for the full schema with every field, enum, and
index.

---

## Routes

### Public

- `/`
- `/login`
- `/register`
- `/unauthorized`

### Shared Dashboard

- `/dashboard`
- `/dashboard/profile`
- `/dashboard/settings`
- `/dashboard/developer` — developer/project details, open to every authenticated role

### Admin

- `/dashboard/admin`
- `/dashboard/admin/users`
- `/dashboard/admin/departments`
- `/dashboard/admin/doctors`
- `/dashboard/admin/patients`
- `/dashboard/admin/appointments`
- `/dashboard/admin/activity-logs`
- `/dashboard/admin/reports`

### Doctor

- `/dashboard/doctor`
- `/dashboard/doctor/appointments`
- `/dashboard/doctor/consultation/[appointmentId]`
- `/dashboard/doctor/patients`
- `/dashboard/doctor/medical-records`
- `/dashboard/doctor/prescriptions`

### Nurse

- `/dashboard/nurse`
- `/dashboard/nurse/queue`
- `/dashboard/nurse/vital-signs`
- `/dashboard/nurse/patient-notes`

### Receptionist

- `/dashboard/receptionist`
- `/dashboard/receptionist/patients`
- `/dashboard/receptionist/appointments`
- `/dashboard/receptionist/queue`
- `/dashboard/receptionist/schedules`

### Pharmacist

- `/dashboard/pharmacist`
- `/dashboard/pharmacist/prescriptions`
- `/dashboard/pharmacist/medicines`
- `/dashboard/pharmacist/inventory`

### Cashier

- `/dashboard/cashier`
- `/dashboard/cashier/invoices`
- `/dashboard/cashier/invoices/[id]`
- `/dashboard/cashier/payments`
- `/dashboard/cashier/reports`

### Patient

- `/dashboard/patient`
- `/dashboard/patient/appointments`
- `/dashboard/patient/medical-history`
- `/dashboard/patient/prescriptions`
- `/dashboard/patient/invoices`

---

## Demo Accounts

All demo accounts use:

```text
Password123!
```

Available accounts:

- `admin@medicore.demo`
- `doctor@medicore.demo`
- `nurse@medicore.demo`
- `receptionist@medicore.demo`
- `pharmacist@medicore.demo`
- `cashier@medicore.demo`
- `patient@medicore.demo`

The login page has a one-click demo account selector that fills in these
credentials for you. `patient@medicore.demo` (Michael Tanuwijaya) is seeded
with a real history: a finalized visit with a dispensed prescription and a
paid invoice, plus one upcoming appointment, so the patient portal isn't
empty on first login.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Required variables:

```env
DATABASE_URL=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
AUTH_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Production example:

```env
NEXTAUTH_URL=https://medicore-hospital-management-system.vercel.app
NEXT_PUBLIC_APP_URL=https://medicore-hospital-management-system.vercel.app
```

Notes:

- do not commit `.env`, `.env.local`, or any secret file
- if your Postgres provider appends `sslmode=require`, switch it to
  `sslmode=verify-full`

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Apply local migration

```bash
npx prisma migrate dev
```

### 5. Seed demo data

```bash
npm run seed
```

`npm run seed` (`prisma/seed.ts`) **wipes and reseeds** every table (in
FK-safe order) with 7 demo users + 4 additional doctors, 8 departments, 5
doctors with weekly schedules, 22 patients, 24 medicines (including
low-stock and expired examples), and a fully connected web of
appointments/medical records/vital signs/prescriptions/invoices/payments
that exercises every enum status value. Safe to re-run any time you want a
clean demo state.

### 6. Start development server

```bash
npm run dev
```

---

## Validation Commands

```bash
npx prisma validate
npx prisma generate
npm run lint
npm run build
```

---

## Bilingual (i18n) Implementation

A lightweight, dependency-free dictionary system (no `next-intl` or
similar): `lib/i18n/dictionaries/{en,id}.ts` are plain nested objects;
`lib/i18n/dictionary.ts` resolves a dot-path key against the active locale,
falling back to English, then to the raw key, so a missing translation
never crashes the UI. `I18nProvider` uses `useSyncExternalStore` against
`localStorage` (rather than `useState` + `useEffect`, to avoid a
React-recommended-against setState-in-effect pattern), and mirrors the
selection to a `medicore-locale` cookie for forward compatibility with
server-rendered locale-aware pages. `useI18n()` exposes
`{ locale, setLocale, t }` to any client component. Database enum values
are never translated — only their displayed labels.

---

## Billing & Payment Model

MediCore records payments as already-completed transactions rather than
integrating a live payment gateway — this mirrors how hospital front-desk
cashiering actually works (cash, transfer, e-wallet, or insurance settled at
the counter, not through an online checkout).

### Payment Methods

`CASH`, `BANK_TRANSFER`, `E_WALLET`, `INSURANCE` — recorded against an
invoice at the time the cashier processes them.

### Invoice Status vs Payment Status

Examples:

- `UNPAID` — no payment recorded yet
- `PARTIALLY_PAID` — `paidAmount < totalAmount`
- `PAID` — `paidAmount >= totalAmount`
- `CANCELLED` — invoice voided

`InvoiceStatus` is always derived from the sum of its payments, never set by
hand, so it cannot drift out of sync with the actual amount collected.

---

## Deployment Notes

### Vercel

- set all environment variables in the Vercel project
- ensure `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` point to the deployed
  domain
- the build script already runs `prisma generate && next build`; the
  `postinstall` script also runs `prisma generate` so the client is always
  in sync with `prisma/schema.prisma`

### Neon

- point `DATABASE_URL` to the Neon database (pooled connection string)
- run `npx prisma migrate deploy` against production before first use, then
  `npm run seed` if you want demo data in production

---

## Security and Concurrency Notes

- dashboard routes are protected by the Next.js Proxy (`proxy.ts`), while
  every Server Action repeats authentication and role checks
  (`requireRole(...)`) on the server
- patient- and doctor-scoped queries always resolve the id from the signed-in
  session, never from client-supplied input
- prescription dispensing runs inside a `$transaction` with an
  insufficient-stock pre-check, so partial/oversold dispensing cannot happen
- payment recording and invoice-status recalculation are kept inside a
  single small transaction to stay atomic without holding Neon's pooled
  connection open too long

These guards are application-level database workflows. The project does not
currently add background reconciliation jobs or a real payment gateway
webhook flow.

---

## Performance Notes

- session lookups (`auth()`) are memoized per request with React's `cache()`,
  since most dashboard pages resolve the session in both the shared layout
  and the page itself
- dashboard metric cards use database-side `count`/`aggregate`/`groupBy`
  queries instead of fetching full rows to sum or count in JavaScript
- `xlsx` is dynamically imported only when a user actually triggers an
  export, instead of shipping in the initial bundle of every page that has
  an export button
- the Postgres connection pool is bounded (`max: 5`) so Vercel's concurrent
  serverless instances don't each open unbounded connections against Neon
- On free-tier serverless/database hosting, the first request after an idle
  period may be slower due to cold starts. The application uses bounded
  database pooling and lazy-loaded export libraries to reduce runtime
  overhead, but a cold Neon compute waking up is outside the application's
  control.

---

## Known Limitations

- no patient self-service appointment booking (registration and booking are
  receptionist/admin-driven, per the intended workflow — the schema and RBAC
  would support adding it later)
- no real payment gateway integration; payments are recorded as already
  completed, not processed through a provider
- no automated test suite (unit/e2e) yet — verification for this build was
  done via `next build`'s type-checking plus targeted, hand-written
  end-to-end checks against the real database for every mutating workflow
- single currency (IDR) and single hospital/tenant — no multi-branch or
  multi-currency support
- no SMS/email/push notifications for appointment reminders
- on Neon's free tier, the database compute suspends after a period of
  idleness, so the first request afterward can be noticeably slower while it
  wakes back up — this is a hosting characteristic, not something the
  application code can fix

---

## Future Improvements

- patient-initiated appointment requests with receptionist approval
- real payment gateway integration (Midtrans/Xendit are common in Indonesia)
- automated test coverage (Vitest/Playwright)
- notification system (email/SMS/WhatsApp) for appointment reminders and
  low-stock/expiry alerts
- multi-branch/multi-tenant support

---

## Repository Notes

- Prisma client output is generated into `app/generated/prisma`
- seed data includes multiple appointment, prescription, invoice, and
  payment states across every enum value
- the project is designed to remain deployable on Vercel with Neon-backed
  PostgreSQL

---

## Author

**Muh. Rinaldi Ruslan**

- GitHub: [xebec51](https://github.com/xebec51)
- LinkedIn: [rinaldiruslan](https://www.linkedin.com/in/rinaldiruslan)
- Email: [rinaldi.ruslan51@gmail.com](mailto:rinaldi.ruslan51@gmail.com)
- Instagram: [@rinaldiruslan](https://www.instagram.com/rinaldiruslan/)
- TikTok: [@rinaldiruslan](https://www.tiktok.com/@rinaldiruslan)

---

## Connect With Me

<p align="left">
  <a href="https://github.com/xebec51">
    <img src="https://img.shields.io/badge/GitHub-xebec51-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="mailto:rinaldi.ruslan51@gmail.com">
    <img src="https://img.shields.io/badge/Email-rinaldi.ruslan51%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
  <a href="https://www.linkedin.com/in/rinaldiruslan">
    <img src="https://img.shields.io/badge/LinkedIn-rinaldiruslan-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="https://www.instagram.com/rinaldiruslan/">
    <img src="https://img.shields.io/badge/Instagram-rinaldiruslan-E4405F?style=for-the-badge&logo=instagram&logoColor=white" />
  </a>
  <a href="https://www.tiktok.com/@rinaldiruslan">
    <img src="https://img.shields.io/badge/TikTok-rinaldiruslan-000000?style=for-the-badge&logo=tiktok&logoColor=white" />
  </a>
</p>

---

<p align="center">
  <strong>MediCore</strong><br />
  Built by <strong>Muh. Rinaldi Ruslan</strong> as a modern hospital management portfolio project.
</p>

<p align="center">
  Crafted with Next.js, Prisma, PostgreSQL, and role-driven clinical workflows.
</p>

<p align="center">
  Not affiliated with any real hospital; all data is synthetic demo data.
</p>
