import { Separator } from "@/src/components/ui/separator";
import { useSearchParams } from "react-router-dom";

import { Heading } from "@/src/components/ui/heading";
import UsersListingPage from "@/src/components/dashboard/users/listing-user-table";
import UserTableAction from "@/src/components/dashboard/users/users-tables/user-table-action";
import { useState } from "react";

export default function AdminUsersPage() {
  const [searchParams] = useSearchParams();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="flex items-start justify-between">
        <Heading title="Users" description="Manage users" />
      </div>
      <Separator />
      <UserTableAction
        selectedUserIds={selectedUserIds}
        setSelectedUserIds={setSelectedUserIds}
      />

      <UsersListingPage
        setSelectedUserIds={setSelectedUserIds}
        searchParams={searchParams}
      />
    </div>
  );
}
