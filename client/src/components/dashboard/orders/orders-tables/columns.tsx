import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Order } from "@/src/@types";
import { formatPrice } from "@/src/lib/utils";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => {
      return <span className="capitalize">{row.original._id}</span>;
    },
  },
  {
    accessorKey: "userId",
    header: "USER ID",
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.userId}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.status}</span>;
    },
  },
  {
    accessorKey: "itemCount",
    header: "ITEM COUNT",
    cell: ({ row }) => {
      return <span>{row.original.items.length}</span>; // Count of items in the order
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "PAYMENT METHOD",
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.paymentMethod}</span>;
    },
  },
  {
    accessorKey: "estimatedDelivery",
    header: "ESTIMATED DELIVERY",
    cell: ({ row }) => {
      return <span>{row.original.estimatedDelivery}</span>;
    },
  },
  {
    accessorKey: "calculatedTotal",
    header: "TOTAL PRICE",
    cell: ({ row }) => {
      return <span>{formatPrice(row.original.calculatedTotal)}</span>; // Display formatted total price
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const orderId = row.original._id;
      return <CellAction orderId={orderId} />;
    },
  },
];
