import { useQuery } from "@tanstack/react-query";
import {
  getRevenue,
  getPaymentStatus,
  getRecentSales,
  getNewAccounts,
} from "@/src/action/analytics";

export const useGetRevenue = () => {
  return useQuery({
    queryKey: ["analytics:revenue"],
    queryFn: getRevenue,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    refetchInterval: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useGetPaymentStatus = () => {
  return useQuery({
    queryKey: ["analytics:payment-status"],
    queryFn: getPaymentStatus,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useGetRecentSales = () => {
  return useQuery({
    queryKey: ["analytics:recent-sales"],
    queryFn: getRecentSales,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useGetNewAccounts = () => {
  return useQuery({
    queryKey: ["analytics:new-accounts"],
    queryFn: getNewAccounts,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    retry: 2,
  });
};
