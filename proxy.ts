import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { roleDashboardPath, type AppRole } from "@/lib/constants/roles";

const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

// Pages every authenticated role may visit regardless of their role prefix.
const SHARED_DASHBOARD_PATHS = ["/dashboard", "/dashboard/profile", "/dashboard/settings", "/dashboard/developer"];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: authSecret });

  if (pathname === "/login") {
    if (token) return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = token.role as AppRole;
    const isSharedPath = SHARED_DASHBOARD_PATHS.includes(pathname);
    const ownRolePrefix = roleDashboardPath[role];
    const isOwnRolePath = pathname === ownRolePrefix || pathname.startsWith(`${ownRolePrefix}/`);

    if (!isSharedPath && !isOwnRolePath) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
