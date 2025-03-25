import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { fetchAllPayments } from "./fetch-all-payments";

interface SalesAnalytics {
  dailySales: Array<{
    date: string;
    desktop: number;
    mobile: number;
    totalRevenue: number;
  }>;
  monthlyTotals: {
    totalRevenue: number;
    totalSales: number;
    averageOrderValue: number;
  };
  salesByPlatform: {
    desktop: number;
    mobile: number;
  };
  topSellingProducts?: Array<{
    productName: string;
    quantity: number;
    revenue: number;
  }>;
}

export async function GetStripeAnalytics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Fetch all payments
    const allPayments = await fetchAllPayments();

    // Filter successful payments for the last 3 months
    const threeMonthsAgo = moment().subtract(3, "months").startOf("day").unix();

    const successfulPayments = allPayments.filter(
      (payment) =>
        payment.status === "succeeded" && payment.created >= threeMonthsAgo
    );

    // Group sales by date
    const salesByDate = successfulPayments.reduce((acc, payment) => {
      const date = moment.unix(payment.created).format("YYYY-MM-DD");

      // Determine platform (this is a mock - you'll need actual platform tracking)
      const isDesktop = Math.random() > 0.5; // Replace with actual platform detection

      if (!acc[date]) {
        acc[date] = {
          desktop: 0,
          mobile: 0,
          totalRevenue: 0,
        };
      }

      const amount = payment.amount_received / 100;

      if (isDesktop) {
        acc[date].desktop += amount;
      } else {
        acc[date].mobile += amount;
      }
      acc[date].totalRevenue += amount;

      return acc;
    }, {} as Record<string, { desktop: number; mobile: number; totalRevenue: number }>);

    // Convert to array and sort
    const dailySales = Object.entries(salesByDate)
      .map(([date, data]) => ({
        date,
        desktop: Math.round(data.desktop),
        mobile: Math.round(data.mobile),
        totalRevenue: Number(data.totalRevenue.toFixed(2)),
      }))
      .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

    // Calculate monthly totals
    const monthlyTotals = {
      totalRevenue: successfulPayments.reduce(
        (total, payment) => total + payment.amount_received / 100,
        0
      ),
      totalSales: successfulPayments.length,
      averageOrderValue:
        successfulPayments.reduce(
          (total, payment) => total + payment.amount_received / 100,
          0
        ) / successfulPayments.length,
    };

    // Sales by platform (mock)
    const salesByPlatform = {
      desktop: dailySales.reduce((total, day) => total + day.desktop, 0),
      mobile: dailySales.reduce((total, day) => total + day.mobile, 0),
    };

    // Construct response
    const analytics: SalesAnalytics = {
      dailySales,
      monthlyTotals: {
        totalRevenue: Number(monthlyTotals.totalRevenue.toFixed(2)),
        totalSales: monthlyTotals.totalSales,
        averageOrderValue: Number(monthlyTotals.averageOrderValue.toFixed(2)),
      },
      salesByPlatform,
    };

    res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
}
