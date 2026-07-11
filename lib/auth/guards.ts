import { auth } from "@/lib/auth/session";
import type { AppRole } from "@/lib/constants/roles";

/** Throws if there's no session or the session's role isn't in the allow-list. Use at the top of every Server Action. */
export async function requireRole(...roles: AppRole[]) {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHENTICATED");
  if (!roles.includes(session.user.role)) throw new Error("FORBIDDEN");
  return session;
}
