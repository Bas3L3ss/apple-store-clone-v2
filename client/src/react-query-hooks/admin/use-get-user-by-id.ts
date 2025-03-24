import { GetUserById } from "@/src/action/auth";
import { useQuery } from "@tanstack/react-query";

interface UseGetUsersParams {
  userId: string;
}

export const useGetUserById = ({ userId }: UseGetUsersParams) => {
  return useQuery({
    queryKey: ["admin:users", { userId }],
    queryFn: () => GetUserById({ userId }),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 2, // Retry fetching twice before failing
  });
};
