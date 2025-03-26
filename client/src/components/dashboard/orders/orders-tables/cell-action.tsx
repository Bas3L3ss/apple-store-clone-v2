import { OrderStatus } from "@/src/@types";
import { editOrderStatus } from "@/src/action/orders";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { invalidateAllOrdersCache } from "@/src/react-query-hooks/use-get-orders-of-user";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ORDER_STATUS = [
  { value: "preparing", label: "Preparing" },
  { value: "delivering", label: "Delivering" },
  { value: "finished", label: "Finished" },
];

export const CellAction = ({
  orderId,
  orderStatus,
}: {
  orderId: string;
  orderStatus: OrderStatus;
}) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [orderStatusInput, setOrderStatusInput] = useState(orderStatus);
  const handleUpdateOrderStatus = async () => {
    setLoading(true);
    try {
      await editOrderStatus(orderId, orderStatusInput);
      invalidateAllOrdersCache(queryClient);
      toast.success("Updated order status");
    } catch (error) {
      toast.error("Something went wrong, please retry");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="grid w-full gap-1.5">
            <Select
              value={orderStatusInput}
              //@ts-expect-error: no prob
              onValueChange={(value) => setOrderStatusInput(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option type" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <article className="flex gap-1.5">
            <Button
              variant={"outline"}
              className="flex-1"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={loading || orderStatus == orderStatusInput}
              onClick={handleUpdateOrderStatus}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </article>
        </DialogContent>
      </Dialog>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setEditOpen(true);
            }}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>{" "}
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(orderId).then(() => {
                toast("Order ID copied to clipboard!");
              });
            }}
          >
            <Edit className="mr-2 h-4 w-4" /> Copy orderId
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
