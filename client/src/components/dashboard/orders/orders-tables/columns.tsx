import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Order } from "@/src/@types";
import { formatPrice } from "@/src/lib/utils";
import { Link } from "react-router";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => {
      return (
        <Link
          to={`/order/${row.original._id}`}
          className="capitalize text-blue-500 hover:underline"
        >
          {row.original._id}
        </Link>
      );
    },
  },
  {
    accessorKey: "userId",
    header: "USER ID",
    cell: ({ row }) => {
      return (
        <Link
          to={`/dashboard/user/${row.original.userId}`}
          className="capitalize text-blue-500 hover:underline"
        >
          {row.original.userId}
        </Link>
      );
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
      return <CellAction orderStatus={row.original.status} orderId={orderId} />;
    },
  },
];
