import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

export const USER_TYPE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];
export const VERIFIED_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "no", label: "No" },
];

export function useUserTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const typeFilter = searchParams.get("type") || "";
  const isVerifiedFilter = searchParams.get("isVerified") || "";

  const page = Number(searchParams.get("page")) || 1;

  const setQueryParams = useCallback(
    (newParams: {
      q?: string;
      isVerified?: string;
      type?: string;
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
    setQueryParams({ q: "", isVerified: "", type: "", page: "1" });
  }, [setQueryParams]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!typeFilter;
  }, [searchQuery, typeFilter]);

  return {
    searchQuery,
    setSearchQuery: (value: string) => setQueryParams({ q: value }),
    page,
    setPage: (value: string) => setQueryParams({ page: value }),
    resetFilters,
    isAnyFilterActive,
    typeFilter,
    isVerifiedFilter,
    setCategoriesFilter: (value: string, filteredKey: string) =>
      setQueryParams({ [filteredKey]: value }),
  };
}
