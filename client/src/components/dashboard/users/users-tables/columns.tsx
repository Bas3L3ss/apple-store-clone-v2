import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { User } from "@/src/@types";
import { Checkbox } from "@/src/components/ui/checkbox";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="size-5 "
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="size-5"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Avatar",
    header: "IMAGE",
    cell: ({ row }) => {
      const user = row.original;
      const imageId = user.avatar || "";

      return (
        <div className="h-16 w-16 relative rounded-md overflow-hidden">
          {imageId ? (
            <img
              src={imageId}
              alt={user.username}
              width={64}
              height={64}
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500">No Avatar</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "NAME",
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.username}</span>;
    },
  },
  {
    accessorKey: "role",
    header: "ROLE",
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.role}</span>;
    },
  },

  {
    accessorKey: "email",
    header: "EMAIL",
    cell: ({ row }) => {
      return row.getValue("email") as string;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const userId = row.original._id;
      return <CellAction userId={userId} />;
    },
  },
];
