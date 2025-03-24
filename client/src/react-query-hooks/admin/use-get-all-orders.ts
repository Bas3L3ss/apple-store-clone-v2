import { getAllOrders } from "@/src/action/orders";
import { useQuery } from "@tanstack/react-query";

interface UseGetUsersParams {
  search?: string;
  status?: string;
  estimatedDelivery?: string;
  paymentMethod?: string;

  page?: string;
  limit?: string;
}

export const useGetAllOrders = ({
  search = "",
  paymentMethod = "",
  status = "",
  page = "1",
  limit = "10",
}: UseGetUsersParams) => {
  return useQuery({
    queryKey: ["admin:orders", { search, page, limit, paymentMethod, status }],
    queryFn: () =>
      getAllOrders({
        search,
        page,
        limit,
        paymentMethod,
        status,
      }),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 2, // Retry fetching twice before failing
  });
};
