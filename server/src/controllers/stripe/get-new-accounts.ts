import { NextFunction, Request, Response } from "express";
import Account from "../../models/Account";
import moment from "moment";

interface NewCustomersCountResponse {
  thisMonth: {
    count: number;
    percentageChange: number;
  };
  lastMonth: {
    count: number;
  };
}

export async function GetNewCustomersCount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Define time ranges
    const thisMonthStart = moment().startOf("month");
    const thisMonthEnd = moment().endOf("month");

    const lastMonthStart = moment().subtract(1, "month").startOf("month");
    const lastMonthEnd = moment().subtract(1, "month").endOf("month");

    // Count new customers this month
    const thisMonthNewCustomers = await Account.countDocuments({
      createdAt: {
        $gte: thisMonthStart.toDate(),
        $lte: thisMonthEnd.toDate(),
      },
    });

    // Count new customers last month
    const lastMonthNewCustomers = await Account.countDocuments({
      createdAt: {
        $gte: lastMonthStart.toDate(),
        $lte: lastMonthEnd.toDate(),
      },
    });

    // Calculate percentage change
    const percentageChange =
      lastMonthNewCustomers > 0
        ? ((thisMonthNewCustomers - lastMonthNewCustomers) /
            lastMonthNewCustomers) *
          100
        : 0;

    // Prepare response
    const response: NewCustomersCountResponse = {
      thisMonth: {
        count: thisMonthNewCustomers,
        percentageChange: Number(percentageChange.toFixed(2)),
      },
      lastMonth: {
        count: lastMonthNewCustomers,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
