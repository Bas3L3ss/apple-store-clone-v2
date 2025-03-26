import { useQuery } from "@tanstack/react-query";
import { getLoggedInDevices } from "../action/auth";

export const useGetLoggedInDevices = (userId?: string) => {
  return useQuery({
    queryKey: ["user:loggedInDevices", userId],
    queryFn: () => getLoggedInDevices(),
    enabled: !!userId, // Prevents fetching if userId is not provided
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1, // Only retry once on failure
  });
};

export default useGetLoggedInDevices;
