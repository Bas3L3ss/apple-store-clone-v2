import { EnrichedSalesResponse } from "@/src/@types";
import { makeAxiosRequest } from "@/src/lib/utils";

export const getRevenue = async () => {
  try {
    const response = await makeAxiosRequest("get", "/analytics/revenue");
    return response;
  } catch (error) {
    console.error("Error fetching revenue:", error);
    return null;
  }
};

export const getPaymentStatus = async () => {
  try {
    const response = await makeAxiosRequest("get", "/analytics/payment-status");
    return response;
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return null;
  }
};

export const getRecentSales = async () => {
  try {
    const response = await makeAxiosRequest<EnrichedSalesResponse>(
      "get",
      "/analytics/recent-sales"
    );
    return response;
  } catch (error) {
    console.error("Error fetching recent sales:", error);
    return [];
  }
};

export const getNewAccounts = async () => {
  try {
    const response = await makeAxiosRequest<{
      lastMonth: { count: number };
      thisMonth: {
        count: number;
        percentageChange: number;
      };
    }>("get", "/analytics/new-customers");
    return response;
  } catch (error) {
    console.error("Error fetching new customers:", error);
    return [];
  }
};
