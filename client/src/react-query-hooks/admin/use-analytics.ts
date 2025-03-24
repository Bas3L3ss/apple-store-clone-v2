import { useQuery } from "@tanstack/react-query";
import {
  getRevenue,
  getPaymentStatus,
  getRecentSales,
  getTopCustomers,
} from "@/src/action/analytics";

export const useGetRevenue = () => {
  return useQuery({
    queryKey: ["analytics:revenue"],
    queryFn: getRevenue,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 2,
  });
};

export const useGetPaymentStatus = () => {
  return useQuery({
    queryKey: ["analytics:payment-status"],
    queryFn: getPaymentStatus,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useGetRecentSales = () => {
  return useQuery({
    queryKey: ["analytics:recent-sales"],
    queryFn: getRecentSales,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useGetTopCustomers = () => {
  return useQuery({
    queryKey: ["analytics:top-customers"],
    queryFn: getTopCustomers,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
