import { NextFunction, Request, Response } from "express";
import { fetchAllPayments } from "./fetch-all-payments";
import moment from "moment";
import Account from "../../models/Account";

export async function GetRecentSales(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payments = await fetchAllPayments();

    // Extract relevant sales data
    const rawSales = payments
      .filter((p) => p.status === "succeeded")
      .sort((a, b) => b.created - a.created)
      .slice(0, 10)
      .map((p) => ({
        amount: p.amount_received / 100,
        currency: p.currency.toUpperCase(),
        customer_email: p.charges.data[0]?.billing_details.email || null,
        date: moment.unix(p.created).format("YYYY-MM-DD HH:mm:ss"),
      }));

    // Get unique emails from sales
    const uniqueEmails = [
      ...new Set(rawSales.map((sale) => sale.customer_email).filter(Boolean)),
    ];
    console.log(uniqueEmails);

    // Fetch user details from the database
    const users = await Account.find(
      { email: { $in: uniqueEmails } },
      "_id username email avatar"
    );

    // Convert users array into a dictionary for quick lookup
    const userMap = users.reduce((acc, user) => {
      acc[user.email] = user;
      return acc;
    }, {} as Record<string, { _id: string; username: string; email: string; avatar: string }>);

    // Merge sales data with user details
    const enrichedSales = rawSales.map((sale) => ({
      ...sale,
      customer: userMap[sale.customer_email] || null, // Add user details if available
    }));

    res.status(200).json(enrichedSales);
  } catch (error) {
    next(error);
  }
}
