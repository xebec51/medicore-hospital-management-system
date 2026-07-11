import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { DeveloperDetailsView } from "@/components/developer/developer-details-view";

export default async function DeveloperDetailsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <DeveloperDetailsView />;
}
