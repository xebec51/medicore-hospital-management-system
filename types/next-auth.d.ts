import type { AppRole } from "@/lib/constants/roles";

declare module "next-auth" {
  interface User {
    id: string;
    role: AppRole;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: AppRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: AppRole;
  }
}
