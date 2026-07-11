import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterInfoPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 surface-gradient-hero px-4 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-info/15 text-info">
        <UserPlus className="size-7" />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">Registration is handled at the front desk</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        For patient safety and identity verification, new patient registration is completed in person or by phone
        with our reception team. If you already have an account, sign in below.
      </p>
      <Button render={<Link href="/login" />}>Go to sign in</Button>
    </div>
  );
}
