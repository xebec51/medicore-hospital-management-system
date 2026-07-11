import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { resolvePatientIdByUserId } from "@/lib/queries/patient-portal";
import { listPatientInvoices } from "@/lib/queries/invoices";
import { EmptyState } from "@/components/empty-state";
import { PatientInvoiceRow } from "@/components/patient/patient-invoice-row";

export default async function PatientInvoicesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const patientId = await resolvePatientIdByUserId(session.user.id);
  if (!patientId) redirect("/unauthorized");

  const invoices = await listPatientInvoices(patientId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My invoices</h1>
        <p className="text-sm text-muted-foreground">Track your billing and payment status.</p>
      </div>

      {invoices.length ? (
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <PatientInvoiceRow key={invoice.id} invoice={invoice} />
          ))}
        </div>
      ) : (
        <EmptyState title="No invoices yet" description="Invoices for your visits will appear here." />
      )}
    </div>
  );
}
