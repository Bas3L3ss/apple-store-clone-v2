import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

export const CATEGORY_OPTIONS = [
  { value: "iphone", label: "Iphone" },
  { value: "ipad", label: "Ipad" },
  { value: "macbook", label: "Macbook" },
  { value: "apple_watch", label: "Apple Watch" },
  { value: "airpods", label: "Airpods" },
  { value: "phonecase", label: "Accessories" },
];

export function useProductTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const categoriesFilter = searchParams.get("categories") || "";
  const page = Number(searchParams.get("page")) || 1;

  const setQueryParams = useCallback(
    (newParams: { q?: string; categories?: string; page?: string }) => {
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
    setQueryParams({ q: "", categories: "", page: "1" });
  }, [setQueryParams]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!categoriesFilter;
  }, [searchQuery, categoriesFilter]);

  return {
    searchQuery,
    setSearchQuery: (value: string) => setQueryParams({ q: value }),
    page,
    setPage: (value: string) => setQueryParams({ page: value }),
    resetFilters,
    isAnyFilterActive,
    categoriesFilter,
    setCategoriesFilter: (value: string) =>
      setQueryParams({ categories: value }),
  };
}
