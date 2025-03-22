import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import CloudinaryImage from "@/src/components/reusable/cloudinary-image";
import { Product } from "@/src/@types";

export const columns: ColumnDef<Product>[] = [
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
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return formatted;
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
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
