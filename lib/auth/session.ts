import { cache } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

// Nearly every dashboard page re-resolves the session (layout + page, sometimes
// deeper), so this is memoized per request to avoid redundant JWT decoding.
export const auth = cache(() => getServerSession(authOptions));
