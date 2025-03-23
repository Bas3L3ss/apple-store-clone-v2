import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import CloudinaryImage from "@/src/components/reusable/cloudinary-image";
import { User } from "@/src/@types";
import { formatPrice } from "@/src/lib/utils";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "Avatar",
    header: "IMAGE",
    cell: ({ row }) => {
      const user = row.original;
      const imageId = user.avatar || "";

      return (
        <div className="h-16 w-16 relative rounded-md overflow-hidden">
          {imageId ? (
            <CloudinaryImage
              publicId={imageId}
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
