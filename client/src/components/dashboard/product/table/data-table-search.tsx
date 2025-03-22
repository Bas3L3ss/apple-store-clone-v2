import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";

interface DataTableSearchProps {
  searchKey: string;
  searchQuery: string | null;
  setSearchQuery: (value: string) => void;
}
export function DataTableSearch({
  searchKey,
  searchQuery,
  setSearchQuery,
}: DataTableSearchProps) {
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <Input
      placeholder={`Search ${searchKey}...`}
      value={searchQuery ?? ""}
      onChange={(e) => handleSearch(e.target.value)}
      className={cn("w-full md:max-w-sm")}
    />
  );
}
