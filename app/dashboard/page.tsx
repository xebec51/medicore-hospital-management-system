import { redirect } from "next/navigation";

// TODO(phase-6): redirect based on the authenticated session's role.
export default function DashboardIndexPage() {
  redirect("/dashboard/admin");
}
