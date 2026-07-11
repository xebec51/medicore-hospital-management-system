import { UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// TODO(phase-6): populate from the authenticated user's profile.
export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your personal account information.</p>
      </div>
      <Card>
        <CardHeader className="flex-row items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound className="size-6" />
          </span>
          <CardTitle>Demo User</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Profile editing will be available once account management is connected.
        </CardContent>
      </Card>
    </div>
  );
}
