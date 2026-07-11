import Link from "next/link";
import { Activity } from "lucide-react";

export default function LoginPlaceholderPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 surface-gradient-hero px-4 py-20 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl surface-gradient-primary text-white">
        <Activity className="size-6" />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">Sign-in is coming online soon</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Authentication is being wired up in a later build phase. Check back shortly.
      </p>
      <Link href="/" className="text-sm font-medium text-primary hover:underline">
        Back to homepage
      </Link>
    </div>
  );
}
