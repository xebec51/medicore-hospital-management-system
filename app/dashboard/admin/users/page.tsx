import { listUsers } from "@/lib/queries/users";
import { DataTable } from "@/components/data-table";
import { userColumns } from "@/components/admin/users/user-columns";
import { UserFormDialog } from "@/components/admin/users/user-form-dialog";

export default async function AdminUsersPage() {
  const users = await listUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">Manage staff and patient accounts across MediCore.</p>
        </div>
        <UserFormDialog />
      </div>

      <DataTable
        columns={userColumns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search by name…"
        emptyTitle="No users yet"
        emptyDescription="Create the first account to get started."
      />
    </div>
  );
}
