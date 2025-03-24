import { NextFunction, Request, Response } from "express";
import { fetchAllPayments } from "./fetch-all-payments";
import Account from "../../models/Account";

export async function GetTopCustomers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payments = await fetchAllPayments();

    // Aggregate spending per email
    const customerSpending: { [email: string]: number } = {};

    for (const p of payments) {
      if (
        p.status === "succeeded" &&
        p.charges.data[0]?.billing_details.email
      ) {
        const email = p.charges.data[0].billing_details.email;
        customerSpending[email] =
          (customerSpending[email] || 0) + p.amount_received;
      }
    }

    // Sort top 3 customers by spending
    const topCustomersData = Object.entries(customerSpending)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Fetch user details from database
    const topCustomers = await Account.find(
      { email: { $in: topCustomersData.map(([email]) => email) } },
      "_id username email avatar"
    );

    // Merge spending data with user details
    const enrichedCustomers = topCustomers.map((user) => {
      const totalSpent = (customerSpending[user.email] || 0) / 100;
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        totalSpent,
      };
    });

    res.status(200).json(enrichedCustomers);
  } catch (error) {
    next(error);
  }
}
