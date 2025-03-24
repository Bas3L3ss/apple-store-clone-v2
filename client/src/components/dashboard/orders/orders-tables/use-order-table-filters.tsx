import { OrderStatus } from "@/src/@types";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

export const PAYMENT_METHOD = [
  { value: "cod:cash-on-delivery", label: "COD" },
  { value: "pp:paypal", label: "Pay Pal" },
  { value: "CC:credit-card", label: "Credit Card" },
  { value: "ac:apple-card", label: "Apple Card" },
];
export const ORDER_STATUS = Object.values(OrderStatus).map((status) => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " "),
}));

export function useOrderTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const paymentMethodFilter = searchParams.get("paymentMethod") || "";
  const statusFilter = searchParams.get("status") || "";

  const page = Number(searchParams.get("page")) || 1;

  const setQueryParams = useCallback(
    (newParams: {
      q?: string;
      paymentMethod?: string;
      status?: string;
      page?: string;
    }) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setQueryParams({
      q: "",
      paymentMethod: "",
      status: "",
      page: "1",
    });
  }, [setQueryParams]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!paymentMethodFilter || !!statusFilter; // Include status filter
  }, [searchQuery, paymentMethodFilter, statusFilter]);

  return {
    searchQuery,
    setSearchQuery: (value: string) => setQueryParams({ q: value }),
    page,
    setPage: (value: string) => setQueryParams({ page: value }),
    resetFilters,
    isAnyFilterActive,
    paymentMethodFilter,
    statusFilter,
    setCategoriesFilter: (value: string, filteredKey: string) =>
      setQueryParams({ [filteredKey]: value }),
  };
}
