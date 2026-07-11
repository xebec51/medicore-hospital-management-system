import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import type { BloodType, Gender, UserRole } from "@/app/generated/prisma/enums";
import {
  generateAppointmentCode,
  generateInvoiceCode,
  generateMedicalRecordNumber,
  generateMedicineCode,
  generatePaymentCode,
  generatePrescriptionCode,
} from "@/lib/domain/codes";
import { calculateInvoiceStatus, calculateInvoiceTotal, toMoneyNumber } from "@/lib/domain/billing";
import { computeMedicineStatus } from "@/lib/domain/medicine";
import { combineDateAndTime, startOfDayUTC } from "@/lib/domain/dates";

const DEMO_PASSWORD = "Password123!";

const today = startOfDayUTC(new Date());
function dayOffset(days: number): Date {
  return new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
}
function atTime(days: number, time: string): Date {
  return combineDateAndTime(dayOffset(days), time);
}
function minutesFrom(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

// Run sequentially (rather than in a single $transaction) so this works
// against Neon's pooled connection, which doesn't reliably support
// long-running interactive transactions.
async function resetDatabase() {
  await prisma.activityLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.prescriptionItem.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.vitalSign.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctorSchedule.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

interface UserSeed {
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

const DEMO_USERS: UserSeed[] = [
  { name: "Sarah Mitchell", email: "admin@medicore.demo", role: "ADMIN", phone: "+62 812 3456 7890" },
  { name: "dr. Ahmad Wijaya", email: "doctor@medicore.demo", role: "DOCTOR", phone: "+62 813 1111 2222" },
  { name: "Nadia Putri", email: "nurse@medicore.demo", role: "NURSE", phone: "+62 813 2222 3333" },
  { name: "Budi Santoso", email: "receptionist@medicore.demo", role: "RECEPTIONIST", phone: "+62 813 3333 4444" },
  { name: "Rina Hartono", email: "pharmacist@medicore.demo", role: "PHARMACIST", phone: "+62 813 4444 5555" },
  { name: "Dewi Lestari", email: "cashier@medicore.demo", role: "CASHIER", phone: "+62 813 5555 6666" },
  { name: "Michael Tanuwijaya", email: "patient@medicore.demo", role: "PATIENT", phone: "+62 813 6666 7777" },
];

const ADDITIONAL_DOCTOR_USERS: UserSeed[] = [
  { name: "dr. Anita Kusuma", email: "anita.kusuma@medicore.demo", role: "DOCTOR" },
  { name: "dr. Bimo Prasetyo", email: "bimo.prasetyo@medicore.demo", role: "DOCTOR" },
  { name: "dr. Clara Susanto", email: "clara.susanto@medicore.demo", role: "DOCTOR" },
  { name: "dr. Dimas Nugroho", email: "dimas.nugroho@medicore.demo", role: "DOCTOR" },
];

async function seedUsers(passwordHash: string) {
  const byEmail = new Map<string, { id: string }>();
  for (const u of [...DEMO_USERS, ...ADDITIONAL_DOCTOR_USERS]) {
    const user = await prisma.user.create({
      data: { name: u.name, email: u.email, password: passwordHash, role: u.role, phone: u.phone ?? null },
    });
    byEmail.set(u.email, user);
  }
  return byEmail;
}

// ---------------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------------

const DEPARTMENTS = [
  {
    name: "General Medicine",
    slug: "general-medicine",
    description: "Primary care and general checkups",
    location: "Building A, 1st Floor",
  },
  {
    name: "Pediatrics",
    slug: "pediatrics",
    description: "Care for infants, children, and adolescents",
    location: "Building A, 2nd Floor",
  },
  {
    name: "Cardiology",
    slug: "cardiology",
    description: "Diagnosis and treatment of heart conditions",
    location: "Building B, 3rd Floor",
  },
  {
    name: "Neurology",
    slug: "neurology",
    description: "Disorders of the brain and nervous system",
    location: "Building B, 3rd Floor",
  },
  {
    name: "Orthopedics",
    slug: "orthopedics",
    description: "Musculoskeletal system care and injury recovery",
    location: "Building A, 2nd Floor",
  },
  {
    name: "Dermatology",
    slug: "dermatology",
    description: "Skin, hair, and nail conditions",
    location: "Building C, 1st Floor",
  },
  {
    name: "Pharmacy",
    slug: "pharmacy",
    description: "Medicine dispensing and inventory management",
    location: "Building A, Ground Floor",
  },
  {
    name: "Emergency",
    slug: "emergency",
    description: "Urgent and emergency care, 24/7",
    location: "Building C, Ground Floor",
  },
];

async function seedDepartments() {
  const bySlug = new Map<string, { id: string }>();
  for (const d of DEPARTMENTS) {
    bySlug.set(d.slug, await prisma.department.create({ data: d }));
  }
  return bySlug;
}

// ---------------------------------------------------------------------------
// Doctors
// ---------------------------------------------------------------------------

interface DoctorSeed {
  email: string;
  departmentSlug: string;
  specialization: string;
  licenseNumber: string;
  consultationFee: number;
  bio: string;
  roomNumber: string;
}

const DOCTORS: DoctorSeed[] = [
  {
    email: "doctor@medicore.demo",
    departmentSlug: "general-medicine",
    specialization: "General Practitioner",
    licenseNumber: "STR-0001-2020",
    consultationFee: 150000,
    bio: "Focused on preventive care and everyday illnesses for the whole family.",
    roomNumber: "101",
  },
  {
    email: "anita.kusuma@medicore.demo",
    departmentSlug: "pediatrics",
    specialization: "Pediatrician",
    licenseNumber: "STR-0002-2019",
    consultationFee: 175000,
    bio: "Ten years of experience in child growth, immunization, and pediatric care.",
    roomNumber: "205",
  },
  {
    email: "bimo.prasetyo@medicore.demo",
    departmentSlug: "cardiology",
    specialization: "Cardiologist",
    licenseNumber: "STR-0003-2015",
    consultationFee: 300000,
    bio: "Specializes in hypertension management and preventive cardiology.",
    roomNumber: "310",
  },
  {
    email: "clara.susanto@medicore.demo",
    departmentSlug: "neurology",
    specialization: "Neurologist",
    licenseNumber: "STR-0004-2017",
    consultationFee: 350000,
    bio: "Focused on headache disorders, epilepsy, and stroke recovery.",
    roomNumber: "312",
  },
  {
    email: "dimas.nugroho@medicore.demo",
    departmentSlug: "orthopedics",
    specialization: "Orthopedic Surgeon",
    licenseNumber: "STR-0005-2016",
    consultationFee: 275000,
    bio: "Specializes in sports injuries, fractures, and joint care.",
    roomNumber: "220",
  },
];

async function seedDoctors(users: Map<string, { id: string }>, departments: Map<string, { id: string }>) {
  const byEmail = new Map<string, { id: string; consultationFee: Prisma.Decimal }>();
  for (const d of DOCTORS) {
    const user = users.get(d.email)!;
    const department = departments.get(d.departmentSlug)!;
    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        departmentId: department.id,
        specialization: d.specialization,
        licenseNumber: d.licenseNumber,
        consultationFee: d.consultationFee,
        bio: d.bio,
        roomNumber: d.roomNumber,
      },
    });
    byEmail.set(d.email, doctor);
  }
  return byEmail;
}

async function seedDoctorSchedules(doctors: Map<string, { id: string }>) {
  for (const doctor of doctors.values()) {
    for (const dayOfWeek of [1, 2, 3, 4, 5]) {
      await prisma.doctorSchedule.create({
        data: { doctorId: doctor.id, dayOfWeek, startTime: "08:00", endTime: "16:00", quota: 20 },
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Patients
// ---------------------------------------------------------------------------

interface PatientSeed {
  name: string;
  gender: Gender;
  birthDate: string;
  phone?: string;
  email?: string;
  address?: string;
  bloodType: BloodType;
  allergies?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  linkedUserEmail?: string;
}

const PATIENTS: PatientSeed[] = [
  {
    name: "Michael Tanuwijaya",
    gender: "MALE",
    birthDate: "1990-04-12",
    phone: "+62 813 6666 7777",
    email: "patient@medicore.demo",
    address: "Jl. Kemang Raya No. 12, Jakarta Selatan",
    bloodType: "O_POSITIVE",
    allergies: "Penicillin",
    emergencyContactName: "Lina Tanuwijaya",
    emergencyContactPhone: "+62 813 6666 8888",
    linkedUserEmail: "patient@medicore.demo",
  },
  {
    name: "Siti Rahmawati",
    gender: "FEMALE",
    birthDate: "1985-08-23",
    phone: "+62 811 1111 0001",
    address: "Jl. Sudirman No. 45, Jakarta Pusat",
    bloodType: "A_POSITIVE",
    emergencyContactName: "Andi Rahman",
    emergencyContactPhone: "+62 811 1111 0002",
  },
  {
    name: "Bagus Setiawan",
    gender: "MALE",
    birthDate: "1978-01-30",
    phone: "+62 811 1111 0003",
    address: "Jl. Gatot Subroto No. 8, Jakarta Selatan",
    bloodType: "B_POSITIVE",
    allergies: "Shellfish",
    emergencyContactName: "Maya Setiawan",
    emergencyContactPhone: "+62 811 1111 0004",
  },
  {
    name: "Putri Ayu Lestari",
    gender: "FEMALE",
    birthDate: "2018-06-14",
    address: "Jl. Fatmawati No. 21, Jakarta Selatan",
    bloodType: "AB_POSITIVE",
    emergencyContactName: "Dedi Lestari",
    emergencyContactPhone: "+62 811 1111 0006",
  },
  {
    name: "Hendra Gunawan",
    gender: "MALE",
    birthDate: "1965-11-02",
    phone: "+62 811 1111 0007",
    address: "Jl. Rasuna Said No. 3, Jakarta Selatan",
    bloodType: "O_NEGATIVE",
    allergies: "Aspirin",
    emergencyContactName: "Sri Gunawan",
    emergencyContactPhone: "+62 811 1111 0008",
  },
  {
    name: "Yusuf Maulana",
    gender: "MALE",
    birthDate: "1995-03-19",
    phone: "+62 811 1111 0009",
    address: "Jl. Panglima Polim No. 9, Jakarta Selatan",
    bloodType: "A_NEGATIVE",
    emergencyContactName: "Rahmat Maulana",
    emergencyContactPhone: "+62 811 1111 0010",
  },
  {
    name: "Ratna Sari",
    gender: "FEMALE",
    birthDate: "1988-12-05",
    phone: "+62 811 1111 0011",
    address: "Jl. Kuningan Barat No. 5, Jakarta Selatan",
    bloodType: "B_NEGATIVE",
    emergencyContactName: "Joko Sari",
    emergencyContactPhone: "+62 811 1111 0012",
  },
  {
    name: "Agus Salim",
    gender: "MALE",
    birthDate: "1972-07-08",
    phone: "+62 811 1111 0013",
    address: "Jl. Cikini Raya No. 17, Jakarta Pusat",
    bloodType: "O_POSITIVE",
    allergies: "Latex",
    emergencyContactName: "Wati Salim",
    emergencyContactPhone: "+62 811 1111 0014",
  },
  {
    name: "Bimo Cardiology Patient",
    gender: "MALE",
    birthDate: "1960-02-27",
    phone: "+62 811 1111 0015",
    address: "Jl. Menteng Raya No. 2, Jakarta Pusat",
    bloodType: "A_POSITIVE",
    emergencyContactName: "Fitri Wijaya",
    emergencyContactPhone: "+62 811 1111 0016",
  },
  {
    name: "Wulan Handayani",
    gender: "FEMALE",
    birthDate: "2001-09-16",
    phone: "+62 811 1111 0017",
    address: "Jl. Tebet Barat No. 11, Jakarta Selatan",
    bloodType: "AB_NEGATIVE",
    emergencyContactName: "Nur Handayani",
    emergencyContactPhone: "+62 811 1111 0018",
  },
  {
    name: "Fajar Nugraha",
    gender: "MALE",
    birthDate: "1993-05-21",
    phone: "+62 811 1111 0019",
    address: "Jl. Antasari No. 6, Jakarta Selatan",
    bloodType: "O_POSITIVE",
    emergencyContactName: "Indah Nugraha",
    emergencyContactPhone: "+62 811 1111 0020",
  },
  {
    name: "Dian Permatasari",
    gender: "FEMALE",
    birthDate: "1998-10-30",
    phone: "+62 811 1111 0021",
    address: "Jl. Radio Dalam No. 4, Jakarta Selatan",
    bloodType: "B_POSITIVE",
    allergies: "Sulfa drugs",
    emergencyContactName: "Doni Permata",
    emergencyContactPhone: "+62 811 1111 0022",
  },
  {
    name: "Teguh Iman Santoso",
    gender: "MALE",
    birthDate: "1955-04-04",
    phone: "+62 811 1111 0023",
    address: "Jl. Pasar Minggu No. 8, Jakarta Selatan",
    bloodType: "UNKNOWN",
    emergencyContactName: "Rini Santoso",
    emergencyContactPhone: "+62 811 1111 0024",
  },
  {
    name: "Novita Anggraini",
    gender: "FEMALE",
    birthDate: "1982-06-11",
    phone: "+62 811 1111 0025",
    address: "Jl. Melawai No. 10, Jakarta Selatan",
    bloodType: "A_POSITIVE",
    emergencyContactName: "Hadi Anggara",
    emergencyContactPhone: "+62 811 1111 0026",
  },
  {
    name: "Rizky Ramadhan",
    gender: "MALE",
    birthDate: "2010-01-25",
    address: "Jl. Kebayoran Lama No. 3, Jakarta Selatan",
    bloodType: "B_POSITIVE",
    allergies: "Peanuts",
    emergencyContactName: "Yanti Ramadhan",
    emergencyContactPhone: "+62 811 1111 0028",
  },
  {
    name: "Lestari Wibowo",
    gender: "FEMALE",
    birthDate: "1975-03-08",
    phone: "+62 811 1111 0029",
    address: "Jl. Cipete Raya No. 15, Jakarta Selatan",
    bloodType: "O_NEGATIVE",
    emergencyContactName: "Bambang Wibowo",
    emergencyContactPhone: "+62 811 1111 0030",
  },
  {
    name: "Andika Pratama",
    gender: "MALE",
    birthDate: "1999-12-19",
    phone: "+62 811 1111 0031",
    address: "Jl. Pondok Indah No. 22, Jakarta Selatan",
    bloodType: "AB_POSITIVE",
    emergencyContactName: "Sinta Pratama",
    emergencyContactPhone: "+62 811 1111 0032",
  },
  {
    name: "Kartika Dewi",
    gender: "FEMALE",
    birthDate: "1991-07-27",
    phone: "+62 811 1111 0033",
    address: "Jl. Senopati No. 19, Jakarta Selatan",
    bloodType: "A_NEGATIVE",
    allergies: "Iodine contrast",
    emergencyContactName: "Bayu Dewangga",
    emergencyContactPhone: "+62 811 1111 0034",
  },
  {
    name: "Surya Wijaya",
    gender: "MALE",
    birthDate: "1968-09-13",
    phone: "+62 811 1111 0035",
    address: "Jl. Kalibata No. 7, Jakarta Selatan",
    bloodType: "B_NEGATIVE",
    emergencyContactName: "Meilani Wijaya",
    emergencyContactPhone: "+62 811 1111 0036",
  },
  {
    name: "Anggi Prasetya",
    gender: "OTHER",
    birthDate: "1997-02-14",
    phone: "+62 811 1111 0037",
    address: "Jl. Duren Tiga No. 13, Jakarta Selatan",
    bloodType: "O_POSITIVE",
    emergencyContactName: "Reza Prasetya",
    emergencyContactPhone: "+62 811 1111 0038",
  },
  {
    name: "Melati Suryani",
    gender: "FEMALE",
    birthDate: "1987-11-23",
    phone: "+62 811 1111 0039",
    address: "Jl. Mampang Prapatan No. 9, Jakarta Selatan",
    bloodType: "A_POSITIVE",
    emergencyContactName: "Iwan Suryana",
    emergencyContactPhone: "+62 811 1111 0040",
  },
  {
    name: "Doni Firmansyah",
    gender: "MALE",
    birthDate: "1980-05-05",
    phone: "+62 811 1111 0041",
    address: "Jl. Tanah Abang No. 2, Jakarta Pusat",
    bloodType: "B_POSITIVE",
    emergencyContactName: "Ayu Firmansyah",
    emergencyContactPhone: "+62 811 1111 0042",
  },
];

async function seedPatients(users: Map<string, { id: string }>) {
  const created: { id: string }[] = [];
  for (const p of PATIENTS) {
    const linkedUser = p.linkedUserEmail ? users.get(p.linkedUserEmail) : undefined;
    const patient = await prisma.patient.create({
      data: {
        userId: linkedUser?.id ?? null,
        medicalRecordNumber: generateMedicalRecordNumber(),
        name: p.name,
        gender: p.gender,
        birthDate: new Date(p.birthDate),
        phone: p.phone ?? null,
        email: p.email ?? null,
        address: p.address ?? null,
        bloodType: p.bloodType,
        allergies: p.allergies ?? null,
        emergencyContactName: p.emergencyContactName ?? null,
        emergencyContactPhone: p.emergencyContactPhone ?? null,
      },
    });
    created.push(patient);
  }
  return created;
}

// ---------------------------------------------------------------------------
// Medicines
// ---------------------------------------------------------------------------

interface MedicineSeed {
  name: string;
  category: string;
  stock: number;
  unit: string;
  minimumStock: number;
  expiryDate: string | null;
  price: number;
}

const MEDICINES: MedicineSeed[] = [
  { name: "Paracetamol 500mg", category: "Analgesic", stock: 500, unit: "tablet", minimumStock: 100, expiryDate: "2027-06-30", price: 2000 },
  { name: "Paracetamol Syrup 120mg/5ml", category: "Analgesic", stock: 80, unit: "bottle", minimumStock: 20, expiryDate: "2027-03-31", price: 25000 },
  { name: "Amoxicillin 500mg", category: "Antibiotic", stock: 300, unit: "capsule", minimumStock: 80, expiryDate: "2027-01-31", price: 3000 },
  { name: "Ceftriaxone 1g Injection", category: "Antibiotic", stock: 40, unit: "vial", minimumStock: 15, expiryDate: "2026-11-30", price: 45000 },
  { name: "Ibuprofen 400mg", category: "Analgesic", stock: 250, unit: "tablet", minimumStock: 60, expiryDate: "2027-05-31", price: 2500 },
  { name: "Diclofenac Sodium 50mg", category: "Analgesic", stock: 60, unit: "tablet", minimumStock: 50, expiryDate: "2026-12-31", price: 3000 },
  { name: "Omeprazole 20mg", category: "Gastrointestinal", stock: 200, unit: "capsule", minimumStock: 50, expiryDate: "2027-04-30", price: 3500 },
  { name: "Domperidone 10mg", category: "Gastrointestinal", stock: 150, unit: "tablet", minimumStock: 40, expiryDate: "2027-02-28", price: 2200 },
  { name: "Loratadine 10mg", category: "Antihistamine", stock: 180, unit: "tablet", minimumStock: 50, expiryDate: "2027-07-31", price: 2800 },
  { name: "Cetirizine 10mg", category: "Antihistamine", stock: 30, unit: "tablet", minimumStock: 50, expiryDate: "2027-08-31", price: 2600 },
  { name: "Amlodipine 5mg", category: "Antihypertensive", stock: 220, unit: "tablet", minimumStock: 60, expiryDate: "2027-09-30", price: 2500 },
  { name: "Captopril 25mg", category: "Antihypertensive", stock: 150, unit: "tablet", minimumStock: 50, expiryDate: "2027-01-31", price: 2000 },
  { name: "Simvastatin 20mg", category: "Cardiovascular", stock: 130, unit: "tablet", minimumStock: 40, expiryDate: "2027-03-31", price: 3200 },
  { name: "Metformin 500mg", category: "Antidiabetic", stock: 300, unit: "tablet", minimumStock: 80, expiryDate: "2027-06-30", price: 1800 },
  { name: "Insulin Glargine 100IU/ml", category: "Antidiabetic", stock: 25, unit: "pen", minimumStock: 10, expiryDate: "2026-10-31", price: 210000 },
  { name: "Salbutamol Inhaler 100mcg", category: "Respiratory", stock: 45, unit: "inhaler", minimumStock: 20, expiryDate: "2027-02-28", price: 55000 },
  { name: "Ambroxol Syrup 15mg/5ml", category: "Respiratory", stock: 70, unit: "bottle", minimumStock: 20, expiryDate: "2027-05-31", price: 22000 },
  { name: "Dexamethasone 0.5mg", category: "Corticosteroid", stock: 12, unit: "tablet", minimumStock: 30, expiryDate: "2026-09-30", price: 1500 },
  { name: "Hydrocortisone Cream 1%", category: "Dermatological", stock: 40, unit: "tube", minimumStock: 15, expiryDate: "2027-04-30", price: 18000 },
  { name: "Vitamin C 500mg", category: "Vitamin", stock: 400, unit: "tablet", minimumStock: 100, expiryDate: "2027-12-31", price: 1500 },
  { name: "Vitamin D3 1000IU", category: "Vitamin", stock: 220, unit: "tablet", minimumStock: 60, expiryDate: "2027-11-30", price: 2200 },
  { name: "Oral Rehydration Salts (Oralit)", category: "Electrolyte", stock: 8, unit: "sachet", minimumStock: 50, expiryDate: "2026-08-31", price: 3000 },
  { name: "Aspirin 100mg", category: "Cardiovascular", stock: 90, unit: "tablet", minimumStock: 30, expiryDate: "2020-01-31", price: 1200 },
  { name: "Ranitidine 150mg", category: "Gastrointestinal", stock: 60, unit: "tablet", minimumStock: 30, expiryDate: "2019-06-30", price: 2000 },
];

async function seedMedicines() {
  const byName = new Map<string, { id: string; stock: number }>();
  for (const m of MEDICINES) {
    const expiryDate = m.expiryDate ? new Date(m.expiryDate) : null;
    const status = computeMedicineStatus(m.stock, m.minimumStock, expiryDate);
    const medicine = await prisma.medicine.create({
      data: {
        medicineCode: generateMedicineCode(),
        name: m.name,
        category: m.category,
        stock: m.stock,
        unit: m.unit,
        minimumStock: m.minimumStock,
        expiryDate,
        price: m.price,
        status,
      },
    });
    byName.set(m.name, medicine);
  }
  return byName;
}

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------

interface AppointmentSeed {
  key: string;
  patientIndex: number;
  doctorEmail: string;
  departmentSlug: string;
  days: number;
  time: string;
  status: "SCHEDULED" | "CHECKED_IN" | "IN_CONSULTATION" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  reason: string;
  cancelledReason?: string;
}

const APPOINTMENTS: AppointmentSeed[] = [
  { key: "a1", patientIndex: 1, doctorEmail: "doctor@medicore.demo", departmentSlug: "general-medicine", days: -7, time: "09:00", status: "COMPLETED", reason: "Fever and persistent cough" },
  { key: "a2", patientIndex: 2, doctorEmail: "doctor@medicore.demo", departmentSlug: "general-medicine", days: -5, time: "10:00", status: "COMPLETED", reason: "Hypertension follow-up checkup" },
  { key: "a3", patientIndex: 8, doctorEmail: "bimo.prasetyo@medicore.demo", departmentSlug: "cardiology", days: -3, time: "09:30", status: "COMPLETED", reason: "Chest pain evaluation" },
  { key: "a4", patientIndex: 3, doctorEmail: "anita.kusuma@medicore.demo", departmentSlug: "pediatrics", days: -2, time: "11:00", status: "COMPLETED", reason: "Routine child vaccination" },
  { key: "a5", patientIndex: 5, doctorEmail: "clara.susanto@medicore.demo", departmentSlug: "neurology", days: -1, time: "13:00", status: "COMPLETED", reason: "Recurring headaches" },
  { key: "a6", patientIndex: 14, doctorEmail: "dimas.nugroho@medicore.demo", departmentSlug: "orthopedics", days: -2, time: "15:00", status: "COMPLETED", reason: "Sprained ankle treatment" },
  { key: "a7", patientIndex: 6, doctorEmail: "dimas.nugroho@medicore.demo", departmentSlug: "orthopedics", days: -4, time: "14:00", status: "NO_SHOW", reason: "Knee pain assessment" },
  { key: "a8", patientIndex: 7, doctorEmail: "doctor@medicore.demo", departmentSlug: "general-medicine", days: -6, time: "10:00", status: "CANCELLED", reason: "General checkup", cancelledReason: "Patient requested reschedule" },
  { key: "a9", patientIndex: 9, doctorEmail: "doctor@medicore.demo", departmentSlug: "general-medicine", days: 0, time: "09:00", status: "CHECKED_IN", reason: "Persistent cough" },
  { key: "a10", patientIndex: 8, doctorEmail: "bimo.prasetyo@medicore.demo", departmentSlug: "cardiology", days: 0, time: "09:30", status: "IN_CONSULTATION", reason: "Hypertension follow-up" },
  { key: "a11", patientIndex: 10, doctorEmail: "doctor@medicore.demo", departmentSlug: "general-medicine", days: 0, time: "15:00", status: "SCHEDULED", reason: "Skin rash" },
  { key: "a12", patientIndex: 11, doctorEmail: "anita.kusuma@medicore.demo", departmentSlug: "pediatrics", days: 2, time: "09:00", status: "SCHEDULED", reason: "Routine growth checkup" },
  { key: "a13", patientIndex: 12, doctorEmail: "clara.susanto@medicore.demo", departmentSlug: "neurology", days: 3, time: "10:00", status: "SCHEDULED", reason: "Migraine consultation" },
  { key: "a14", patientIndex: 13, doctorEmail: "dimas.nugroho@medicore.demo", departmentSlug: "orthopedics", days: 5, time: "11:00", status: "SCHEDULED", reason: "Fracture follow-up" },
  { key: "a15", patientIndex: 15, doctorEmail: "bimo.prasetyo@medicore.demo", departmentSlug: "cardiology", days: 7, time: "09:00", status: "SCHEDULED", reason: "Annual heart checkup" },
  { key: "a16", patientIndex: 16, doctorEmail: "doctor@medicore.demo", departmentSlug: "general-medicine", days: 10, time: "09:00", status: "SCHEDULED", reason: "General consultation" },
];

async function seedAppointments(
  patients: { id: string }[],
  doctors: Map<string, { id: string }>,
  departments: Map<string, { id: string }>,
  users: Map<string, { id: string }>,
) {
  const receptionist = users.get("receptionist@medicore.demo")!;
  const queueCounters = new Map<string, number>();
  const byKey = new Map<
    string,
    { id: string; status: string; days: number; time: string; doctorEmail: string; patientId: string }
  >();

  for (const a of APPOINTMENTS) {
    const doctor = doctors.get(a.doctorEmail)!;
    const department = departments.get(a.departmentSlug)!;
    const patient = patients[a.patientIndex];
    const appointmentDate = dayOffset(a.days);
    const counterKey = `${doctor.id}-${a.days}`;
    const queueNumber = (queueCounters.get(counterKey) ?? 0) + 1;
    queueCounters.set(counterKey, queueNumber);

    const scheduledAt = atTime(a.days, a.time);
    const checkedInAt = ["CHECKED_IN", "IN_CONSULTATION", "COMPLETED"].includes(a.status)
      ? minutesFrom(scheduledAt, -15)
      : null;
    const consultationStartedAt = ["IN_CONSULTATION", "COMPLETED"].includes(a.status) ? scheduledAt : null;
    const completedAt = a.status === "COMPLETED" ? minutesFrom(scheduledAt, 20) : null;

    const appointment = await prisma.appointment.create({
      data: {
        appointmentCode: generateAppointmentCode(),
        patientId: patient.id,
        doctorId: doctor.id,
        departmentId: department.id,
        appointmentDate,
        queueNumber,
        status: a.status,
        reason: a.reason,
        checkedInAt,
        consultationStartedAt,
        completedAt,
        cancelledReason: a.cancelledReason ?? null,
        createdBy: receptionist.id,
      },
    });

    byKey.set(a.key, {
      id: appointment.id,
      status: a.status,
      days: a.days,
      time: a.time,
      doctorEmail: a.doctorEmail,
      patientId: patient.id,
    });
  }

  return byKey;
}

// ---------------------------------------------------------------------------
// Medical records & vital signs
// ---------------------------------------------------------------------------

interface MedicalRecordSeed {
  appointmentKey: string;
  doctorEmail: string;
  chiefComplaint: string;
  diagnosis: string | null;
  doctorNotes: string;
  treatmentPlan: string | null;
  followUpDays: number | null;
  status: "DRAFT" | "FINALIZED";
}

const MEDICAL_RECORDS: MedicalRecordSeed[] = [
  {
    appointmentKey: "a1",
    doctorEmail: "doctor@medicore.demo",
    chiefComplaint: "Fever for 3 days with productive cough",
    diagnosis: "Acute viral pharyngitis",
    doctorNotes: "No signs of bacterial infection. Advised rest and hydration.",
    treatmentPlan: "Rest, hydration, paracetamol for fever, amoxicillin as a precaution.",
    followUpDays: null,
    status: "FINALIZED",
  },
  {
    appointmentKey: "a2",
    doctorEmail: "doctor@medicore.demo",
    chiefComplaint: "Routine hypertension follow-up",
    diagnosis: "Hypertension, stable on current medication",
    doctorNotes: "Blood pressure well controlled. Continue current regimen.",
    treatmentPlan: "Continue amlodipine 5mg daily, monitor blood pressure weekly.",
    followUpDays: 30,
    status: "FINALIZED",
  },
  {
    appointmentKey: "a3",
    doctorEmail: "bimo.prasetyo@medicore.demo",
    chiefComplaint: "Intermittent chest pain over the past week",
    diagnosis: "Non-cardiac chest pain, likely musculoskeletal",
    doctorNotes: "ECG unremarkable. No signs of acute coronary syndrome.",
    treatmentPlan: "NSAIDs for pain relief, follow-up in two weeks if symptoms persist.",
    followUpDays: 14,
    status: "FINALIZED",
  },
  {
    appointmentKey: "a4",
    doctorEmail: "anita.kusuma@medicore.demo",
    chiefComplaint: "Scheduled immunization visit",
    diagnosis: "Routine immunization, no acute illness",
    doctorNotes: "Child is healthy and developing normally. DPT vaccine administered.",
    treatmentPlan: "Next immunization dose due in 2 months.",
    followUpDays: 60,
    status: "FINALIZED",
  },
  {
    appointmentKey: "a5",
    doctorEmail: "clara.susanto@medicore.demo",
    chiefComplaint: "Recurring headaches over the past month",
    diagnosis: null,
    doctorNotes: "Suspect tension-type headache. Needs further evaluation before diagnosis.",
    treatmentPlan: null,
    followUpDays: null,
    status: "DRAFT",
  },
  {
    appointmentKey: "a6",
    doctorEmail: "dimas.nugroho@medicore.demo",
    chiefComplaint: "Ankle pain and swelling after a fall",
    diagnosis: "Grade 1 ankle sprain",
    doctorNotes: "Mild swelling, full range of motion preserved. X-ray not indicated.",
    treatmentPlan: "RICE protocol, ibuprofen for pain and swelling, follow-up in 1 week if not improving.",
    followUpDays: 7,
    status: "FINALIZED",
  },
  {
    appointmentKey: "a10",
    doctorEmail: "bimo.prasetyo@medicore.demo",
    chiefComplaint: "Follow-up for hypertension management",
    diagnosis: null,
    doctorNotes: "Consultation in progress.",
    treatmentPlan: null,
    followUpDays: null,
    status: "DRAFT",
  },
];

async function seedMedicalRecords(
  appointments: Map<string, { id: string; patientId: string; days: number }>,
  doctors: Map<string, { id: string }>,
) {
  const byAppointmentKey = new Map<string, { id: string; patientId: string; status: string }>();
  for (const r of MEDICAL_RECORDS) {
    const appointment = appointments.get(r.appointmentKey)!;
    const doctor = doctors.get(r.doctorEmail)!;
    const record = await prisma.medicalRecord.create({
      data: {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        doctorId: doctor.id,
        chiefComplaint: r.chiefComplaint,
        diagnosis: r.diagnosis,
        doctorNotes: r.doctorNotes,
        treatmentPlan: r.treatmentPlan,
        followUpDate: r.followUpDays != null ? dayOffset(appointment.days + r.followUpDays) : null,
        status: r.status,
      },
    });
    byAppointmentKey.set(r.appointmentKey, { id: record.id, patientId: appointment.patientId, status: r.status });
  }
  return byAppointmentKey;
}

const VITAL_SIGN_APPOINTMENTS: { appointmentKey: string; bloodPressure: string; heartRate: number; temperature: number; weight: number; height: number; oxygenSaturation: number }[] = [
  { appointmentKey: "a1", bloodPressure: "118/76", heartRate: 88, temperature: 38.2, weight: 62, height: 165, oxygenSaturation: 97 },
  { appointmentKey: "a2", bloodPressure: "132/84", heartRate: 74, temperature: 36.6, weight: 78, height: 172, oxygenSaturation: 98 },
  { appointmentKey: "a3", bloodPressure: "128/82", heartRate: 80, temperature: 36.8, weight: 84, height: 175, oxygenSaturation: 97 },
  { appointmentKey: "a4", bloodPressure: "100/64", heartRate: 96, temperature: 36.9, weight: 18, height: 102, oxygenSaturation: 99 },
  { appointmentKey: "a5", bloodPressure: "122/78", heartRate: 72, temperature: 36.5, weight: 58, height: 160, oxygenSaturation: 98 },
  { appointmentKey: "a6", bloodPressure: "120/80", heartRate: 76, temperature: 36.7, weight: 70, height: 168, oxygenSaturation: 98 },
  { appointmentKey: "a9", bloodPressure: "124/80", heartRate: 90, temperature: 37.6, weight: 66, height: 163, oxygenSaturation: 96 },
  { appointmentKey: "a10", bloodPressure: "130/86", heartRate: 78, temperature: 36.6, weight: 84, height: 175, oxygenSaturation: 97 },
];

async function seedVitalSigns(
  appointments: Map<string, { id: string; patientId: string }>,
  users: Map<string, { id: string }>,
) {
  const nurse = users.get("nurse@medicore.demo")!;
  for (const v of VITAL_SIGN_APPOINTMENTS) {
    const appointment = appointments.get(v.appointmentKey)!;
    await prisma.vitalSign.create({
      data: {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        recordedBy: nurse.id,
        bloodPressure: v.bloodPressure,
        heartRate: v.heartRate,
        temperature: v.temperature,
        weight: v.weight,
        height: v.height,
        oxygenSaturation: v.oxygenSaturation,
      },
    });
  }
}

// ---------------------------------------------------------------------------
// Prescriptions
// ---------------------------------------------------------------------------

interface PrescriptionItemSeed {
  medicineName: string;
  quantity: number;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface PrescriptionSeed {
  appointmentKey: string;
  doctorEmail: string;
  status: "PENDING" | "PREPARED" | "DISPENSED" | "CANCELLED";
  notes?: string;
  items: PrescriptionItemSeed[];
}

const PRESCRIPTIONS: PrescriptionSeed[] = [
  {
    appointmentKey: "a1",
    doctorEmail: "doctor@medicore.demo",
    status: "DISPENSED",
    notes: "Complete the full antibiotic course even if symptoms improve.",
    items: [
      { medicineName: "Paracetamol 500mg", quantity: 10, dosage: "500mg", frequency: "3x daily", duration: "5 days", instructions: "Take after meals" },
      { medicineName: "Amoxicillin 500mg", quantity: 15, dosage: "500mg", frequency: "3x daily", duration: "5 days", instructions: "Complete full course" },
    ],
  },
  {
    appointmentKey: "a2",
    doctorEmail: "doctor@medicore.demo",
    status: "DISPENSED",
    items: [{ medicineName: "Amlodipine 5mg", quantity: 30, dosage: "5mg", frequency: "1x daily", duration: "30 days", instructions: "Take in the morning" }],
  },
  {
    appointmentKey: "a3",
    doctorEmail: "bimo.prasetyo@medicore.demo",
    status: "PREPARED",
    items: [{ medicineName: "Ibuprofen 400mg", quantity: 10, dosage: "400mg", frequency: "2x daily", duration: "5 days", instructions: "Take with food" }],
  },
  {
    appointmentKey: "a4",
    doctorEmail: "anita.kusuma@medicore.demo",
    status: "PENDING",
    items: [
      { medicineName: "Vitamin C 500mg", quantity: 20, dosage: "250mg", frequency: "1x daily", duration: "20 days" },
      { medicineName: "Paracetamol Syrup 120mg/5ml", quantity: 1, dosage: "5ml", frequency: "As needed", duration: "For fever" },
    ],
  },
  {
    appointmentKey: "a5",
    doctorEmail: "clara.susanto@medicore.demo",
    status: "CANCELLED",
    notes: "Cancelled pending further diagnostic evaluation.",
    items: [{ medicineName: "Ibuprofen 400mg", quantity: 10, dosage: "400mg", frequency: "2x daily", duration: "5 days" }],
  },
  {
    appointmentKey: "a6",
    doctorEmail: "dimas.nugroho@medicore.demo",
    status: "DISPENSED",
    items: [{ medicineName: "Diclofenac Sodium 50mg", quantity: 10, dosage: "50mg", frequency: "2x daily", duration: "5 days", instructions: "Take with food" }],
  },
];

async function seedPrescriptions(
  medicalRecords: Map<string, { id: string; patientId: string }>,
  appointments: Map<string, { id: string; doctorEmail: string }>,
  doctors: Map<string, { id: string }>,
  medicines: Map<string, { id: string; stock: number }>,
  users: Map<string, { id: string }>,
) {
  const pharmacist = users.get("pharmacist@medicore.demo")!;
  const created: { appointmentKey: string; id: string; status: string; items: { medicineName: string; quantity: number; unitPrice: number }[] }[] = [];

  for (const p of PRESCRIPTIONS) {
    const record = medicalRecords.get(p.appointmentKey)!;
    const appointment = appointments.get(p.appointmentKey)!;
    const doctor = doctors.get(p.doctorEmail)!;

    const now = ["PREPARED", "DISPENSED"].includes(p.status) ? new Date() : null;
    const prescription = await prisma.prescription.create({
      data: {
        prescriptionCode: generatePrescriptionCode(),
        medicalRecordId: record.id,
        appointmentId: appointment.id,
        patientId: record.patientId,
        doctorId: doctor.id,
        status: p.status,
        notes: p.notes ?? null,
        preparedAt: now,
        preparedBy: now ? pharmacist.id : null,
        dispensedAt: p.status === "DISPENSED" ? new Date() : null,
        dispensedBy: p.status === "DISPENSED" ? pharmacist.id : null,
      },
    });

    const itemsForInvoice: { medicineName: string; quantity: number; unitPrice: number }[] = [];
    for (const item of p.items) {
      const medicine = medicines.get(item.medicineName)!;
      await prisma.prescriptionItem.create({
        data: {
          prescriptionId: prescription.id,
          medicineId: medicine.id,
          quantity: item.quantity,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          instructions: item.instructions ?? null,
        },
      });

      const medicineRecord = await prisma.medicine.findUniqueOrThrow({ where: { id: medicine.id } });
      itemsForInvoice.push({ medicineName: item.medicineName, quantity: item.quantity, unitPrice: toMoneyNumber(medicineRecord.price) });

      if (p.status === "DISPENSED") {
        const nextStock = medicineRecord.stock - item.quantity;
        await prisma.medicine.update({
          where: { id: medicine.id },
          data: {
            stock: nextStock,
            status: computeMedicineStatus(nextStock, medicineRecord.minimumStock, medicineRecord.expiryDate),
          },
        });
      }
    }

    created.push({ appointmentKey: p.appointmentKey, id: prescription.id, status: p.status, items: itemsForInvoice });
  }

  return created;
}

// ---------------------------------------------------------------------------
// Invoices & payments
// ---------------------------------------------------------------------------

interface InvoiceSeed {
  appointmentKey: string;
  status: "UNPAID" | "PARTIALLY_PAID" | "PAID" | "CANCELLED";
  paidFraction: number;
  paymentMethod?: "CASH" | "BANK_TRANSFER" | "E_WALLET" | "INSURANCE";
  extraFailedPayment?: boolean;
}

const INVOICES: InvoiceSeed[] = [
  { appointmentKey: "a1", status: "PAID", paidFraction: 1, paymentMethod: "CASH" },
  { appointmentKey: "a2", status: "PAID", paidFraction: 1, paymentMethod: "BANK_TRANSFER" },
  { appointmentKey: "a3", status: "PARTIALLY_PAID", paidFraction: 0.5, paymentMethod: "E_WALLET" },
  { appointmentKey: "a4", status: "PARTIALLY_PAID", paidFraction: 0.4, paymentMethod: "INSURANCE" },
  { appointmentKey: "a5", status: "CANCELLED", paidFraction: 0 },
  { appointmentKey: "a6", status: "UNPAID", paidFraction: 0, extraFailedPayment: true },
];

async function seedInvoicesAndPayments(
  appointments: Map<string, { id: string; patientId: string; doctorEmail: string }>,
  doctors: Map<string, { id: string; consultationFee: Prisma.Decimal }>,
  prescriptions: { appointmentKey: string; items: { medicineName: string; quantity: number; unitPrice: number }[] }[],
  users: Map<string, { id: string }>,
) {
  const cashier = users.get("cashier@medicore.demo")!;
  const prescriptionByKey = new Map(prescriptions.map((p) => [p.appointmentKey, p]));

  for (const inv of INVOICES) {
    const appointment = appointments.get(inv.appointmentKey)!;
    const doctor = doctors.get(appointment.doctorEmail)!;
    const consultationFee = toMoneyNumber(doctor.consultationFee);
    const prescription = prescriptionByKey.get(inv.appointmentKey);

    const lineItems: { description: string; quantity: number; unitPrice: number }[] = [
      { description: "Consultation fee", quantity: 1, unitPrice: consultationFee },
      ...(prescription?.items.map((i) => ({ description: `Medicine — ${i.medicineName}`, quantity: i.quantity, unitPrice: i.unitPrice })) ?? []),
    ];

    const totalAmount = calculateInvoiceTotal(lineItems);
    const paidAmount = inv.status === "CANCELLED" ? 0 : toMoneyNumber(totalAmount) * inv.paidFraction;
    const status = inv.status === "CANCELLED" ? "CANCELLED" : calculateInvoiceStatus(totalAmount, paidAmount);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceCode: generateInvoiceCode(),
        patientId: appointment.patientId,
        appointmentId: appointment.id,
        status,
        totalAmount,
        paidAmount,
        dueDate: dayOffset(14),
      },
    });

    for (const item of lineItems) {
      await prisma.invoiceItem.create({
        data: {
          invoiceId: invoice.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.unitPrice * item.quantity,
        },
      });
    }

    if (inv.paymentMethod && paidAmount > 0) {
      await prisma.payment.create({
        data: {
          paymentCode: generatePaymentCode(),
          invoiceId: invoice.id,
          amount: paidAmount,
          method: inv.paymentMethod,
          status: "COMPLETED",
          paidAt: new Date(),
          referenceNumber: `${inv.paymentMethod}-${invoice.invoiceCode}`,
          processedBy: cashier.id,
        },
      });
    }

    if (inv.extraFailedPayment) {
      await prisma.payment.create({
        data: {
          paymentCode: generatePaymentCode(),
          invoiceId: invoice.id,
          amount: toMoneyNumber(totalAmount),
          method: "E_WALLET",
          status: "FAILED",
          referenceNumber: `E_WALLET-${invoice.invoiceCode}-ATTEMPT1`,
          processedBy: cashier.id,
          notes: "Payment gateway timeout — patient asked to retry at the counter.",
        },
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Activity logs
// ---------------------------------------------------------------------------

async function seedActivityLogs(users: Map<string, { id: string }>) {
  const admin = users.get("admin@medicore.demo")!;
  const doctor = users.get("doctor@medicore.demo")!;
  const nurse = users.get("nurse@medicore.demo")!;
  const receptionist = users.get("receptionist@medicore.demo")!;
  const pharmacist = users.get("pharmacist@medicore.demo")!;
  const cashier = users.get("cashier@medicore.demo")!;

  const entries: { userId: string; action: string; module: string; description: string; days: number }[] = [
    { userId: receptionist.id, action: "CREATE", module: "Patients", description: "Registered new patient Siti Rahmawati", days: -7 },
    { userId: receptionist.id, action: "CREATE", module: "Appointments", description: "Created appointment for Siti Rahmawati with dr. Ahmad Wijaya", days: -7 },
    { userId: receptionist.id, action: "UPDATE", module: "Appointments", description: "Checked in patient for appointment APT queue", days: -7 },
    { userId: doctor.id, action: "UPDATE", module: "Consultation", description: "Started consultation for patient Siti Rahmawati", days: -7 },
    { userId: doctor.id, action: "UPDATE", module: "Medical Records", description: "Finalized medical record for Siti Rahmawati", days: -7 },
    { userId: doctor.id, action: "CREATE", module: "Prescriptions", description: "Created prescription for Siti Rahmawati", days: -7 },
    { userId: pharmacist.id, action: "UPDATE", module: "Pharmacy", description: "Prepared prescription for Siti Rahmawati", days: -6 },
    { userId: pharmacist.id, action: "UPDATE", module: "Pharmacy", description: "Dispensed prescription for Siti Rahmawati", days: -6 },
    { userId: cashier.id, action: "CREATE", module: "Billing", description: "Generated invoice for appointment with dr. Ahmad Wijaya", days: -6 },
    { userId: cashier.id, action: "UPDATE", module: "Billing", description: "Processed cash payment for Siti Rahmawati", days: -6 },
    { userId: nurse.id, action: "CREATE", module: "Vital Signs", description: "Recorded vital signs for Bagus Setiawan", days: -3 },
    { userId: doctor.id, action: "UPDATE", module: "Consultation", description: "Started consultation for Bimo Cardiology Patient", days: 0 },
    { userId: pharmacist.id, action: "UPDATE", module: "Inventory", description: "Flagged Aspirin 100mg and Ranitidine 150mg as expired", days: -1 },
    { userId: pharmacist.id, action: "UPDATE", module: "Inventory", description: "Flagged Cetirizine 10mg and Oral Rehydration Salts as low stock", days: -1 },
    { userId: admin.id, action: "CREATE", module: "Users", description: "Onboarded 4 additional doctor accounts", days: -30 },
    { userId: admin.id, action: "UPDATE", module: "Departments", description: "Updated department listing for Cardiology", days: -20 },
    { userId: receptionist.id, action: "UPDATE", module: "Appointments", description: "Cancelled appointment for Agus Salim at patient's request", days: -6 },
    { userId: receptionist.id, action: "UPDATE", module: "Appointments", description: "Marked appointment as no-show for Ratna Sari", days: -4 },
    { userId: admin.id, action: "LOGIN", module: "Auth", description: "Admin signed in to MediCore", days: 0 },
    { userId: cashier.id, action: "LOGIN", module: "Auth", description: "Cashier signed in to MediCore", days: 0 },
  ];

  for (const e of entries) {
    await prisma.activityLog.create({
      data: {
        userId: e.userId,
        action: e.action,
        module: e.module,
        description: e.description,
        createdAt: dayOffset(e.days),
      },
    });
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Resetting existing MediCore data...");
  await resetDatabase();

  console.log("Seeding users...");
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const users = await seedUsers(passwordHash);

  console.log("Seeding departments...");
  const departments = await seedDepartments();

  console.log("Seeding doctors and schedules...");
  const doctors = await seedDoctors(users, departments);
  await seedDoctorSchedules(doctors);

  console.log("Seeding patients...");
  const patients = await seedPatients(users);

  console.log("Seeding medicines...");
  const medicines = await seedMedicines();

  console.log("Seeding appointments...");
  const appointments = await seedAppointments(patients, doctors, departments, users);

  console.log("Seeding medical records and vital signs...");
  const medicalRecords = await seedMedicalRecords(appointments, doctors);
  await seedVitalSigns(appointments, users);

  console.log("Seeding prescriptions...");
  const prescriptions = await seedPrescriptions(medicalRecords, appointments, doctors, medicines, users);

  console.log("Seeding invoices and payments...");
  await seedInvoicesAndPayments(appointments, doctors, prescriptions, users);

  console.log("Seeding activity logs...");
  await seedActivityLogs(users);

  console.log("MediCore seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
