import { GetDashboardUsers } from "@/src/action/auth";
import { useQuery } from "@tanstack/react-query";

interface UseGetUsersParams {
  search?: string;
  type?: string;
  isVerified?: string;
  page?: string;
  limit?: string;
}

export const useGetUsers = ({
  search = "",
  type = "",
  isVerified = "",
  page = "1",
  limit = "10",
}: UseGetUsersParams) => {
  return useQuery({
    queryKey: ["admin:users", { search, type, page, limit, isVerified }],
    queryFn: () => GetDashboardUsers({ search, isVerified, page, limit, type }),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 2, // Retry fetching twice before failing
  });
};
