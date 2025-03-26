import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import CloudinaryImage from "@/src/components/reusable/cloudinary-image";
import { Product } from "@/src/@types";
import { formatPrice } from "@/src/lib/utils";
import { Checkbox } from "@/src/components/ui/checkbox";

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="size-5"
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
    accessorKey: "productImages",
    header: "IMAGE",
    cell: ({ row }) => {
      const product = row.original;
      const imageId = product.productImages[0] || "";

      return (
        <div className="h-16 w-16 relative rounded-md overflow-hidden">
          {imageId ? (
            <CloudinaryImage
              publicId={imageId}
              alt={product.name}
              width={64}
              height={64}
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500">No image</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.category}</span>;
    },
  },
  {
    accessorKey: "basePrice",
    header: "PRICE",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("basePrice"));

      return formatPrice(price);
    },
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      // Truncate long descriptions
      return description.length > 100
        ? `${description.substring(0, 100)}...`
        : description;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const productId = row.original._id;
      return <CellAction productId={productId} />;
    },
  },
];
