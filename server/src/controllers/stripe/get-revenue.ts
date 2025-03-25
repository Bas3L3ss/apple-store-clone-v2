import moment from "moment";
import { fetchAllPayments } from "./fetch-all-payments";
import { NextFunction, Request, Response } from "express";

export async function GetRevenue(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payments = await fetchAllPayments();

    const startOfThisMonth = moment().startOf("month").unix();
    const startOfLastMonth = moment()
      .subtract(1, "month")
      .startOf("month")
      .unix();
    const endOfLastMonth = moment().subtract(1, "month").endOf("month").unix();

    let thisMonthRevenue = 0,
      lastMonthRevenue = 0;

    for (const p of payments) {
      if (p.status === "succeeded") {
        const amount = p.amount_received / 100;

        if (p.created >= startOfThisMonth) {
          thisMonthRevenue += amount;
        }
        if (p.created >= startOfLastMonth && p.created <= endOfLastMonth) {
          lastMonthRevenue += amount;
        }
      }
    }

    res.status(200).json({
      totalRevenue: thisMonthRevenue,
      lastMonthRevenue,
      revenueComparison:
        (
          ((thisMonthRevenue - lastMonthRevenue) / (lastMonthRevenue || 1)) *
          100
        ).toFixed(2) + "%",
    });
  } catch (error) {
    next(error);
  }
}
