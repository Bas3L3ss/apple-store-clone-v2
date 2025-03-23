import { buttonVariants } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Plus } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { cn } from "@/src/lib/utils";
import { Heading } from "@/src/components/ui/heading";
import UsersListingPage from "@/src/components/dashboard/users/listing-user-table";
import UserTableAction from "@/src/components/dashboard/users/users-tables/user-table-action";

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="flex items-start justify-between">
        <Heading
          title="Products"
          description="Manage products (Server side table functionalities.)"
        />
        <Link
          to="/dashboard/user/create"
          className={cn(buttonVariants(), "text-xs md:text-sm")}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      <Separator />
      <UserTableAction />

      <UsersListingPage searchParams={searchParams} />
    </div>
  );
}
