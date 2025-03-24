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
    const response = await makeAxiosRequest("get", "/analytics/recent-sales");
    return response;
  } catch (error) {
    console.error("Error fetching recent sales:", error);
    return [];
  }
};

export const getTopCustomers = async () => {
  try {
    const response = await makeAxiosRequest("get", "/analytics/top-customers");
    return response;
  } catch (error) {
    console.error("Error fetching top customers:", error);
    return [];
  }
};
