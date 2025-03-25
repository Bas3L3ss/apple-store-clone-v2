import { NextFunction, Request, Response } from "express";
import { fetchAllPayments } from "./fetch-all-payments";
import moment from "moment";
import Account from "../../models/Account";
import { stripe } from "../../utils/stripe";
import Stripe from "stripe";

interface EnrichedSalesResponse {
  sales: EnrichedSale[];
  monthlySalesCount: number;
  monthlyTotalRevenue: number;
}

interface EnrichedSale {
  amount: number;
  currency: string;
  customer_email: string | null;
  date: string;
  customer?: {
    _id: string;
    username: string;
    email: string;
    avatar: string;
  } | null;
}

export async function GetRecentSales(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const allPayments = await fetchAllPayments();

    // Filter payments for the current month
    const currentMonthStart = moment().startOf("month").unix();
    const currentMonthPayments = allPayments.filter(
      (p) => p.status === "succeeded" && p.created >= currentMonthStart
    );

    // Calculate monthly sales metrics
    const monthlySalesCount = currentMonthPayments.length;
    const monthlyTotalRevenue = currentMonthPayments.reduce(
      (total, payment) => total + payment.amount_received / 100,
      0
    );

    // Filter and sort recent payments
    const recentPayments = allPayments
      .filter((p) => p.status === "succeeded")
      .sort((a, b) => b.created - a.created)
      .slice(0, 7);

    // Fetch customer emails from Stripe
    const customerEmails = await Promise.all(
      recentPayments.map(async (payment) => {
        try {
          // @ts-expect-errorL no prob
          const customer = await stripe.customers.retrieve(payment.customer);
          return {
            paymentId: payment.id,
            email: (customer as Stripe.Customer).email || null,
          };
        } catch (error) {
          console.error(
            `Failed to fetch customer for payment ${payment.id}:`,
            error
          );
          return null;
        }
      })
    );

    // Create a map of payment IDs to emails
    const customerEmailMap = customerEmails.reduce((acc, item) => {
      if (item) {
        acc[item.paymentId] = item.email;
      }
      return acc;
    }, {} as Record<string, string | null>);

    // Extract sales data with emails
    const rawSales = recentPayments.map((p) => ({
      amount: p.amount_received / 100,
      currency: p.currency.toUpperCase(),
      customer_email: customerEmailMap[p.id] || null,
      date: moment.unix(p.created).format("YYYY-MM-DD HH:mm:ss"),
    }));

    // Get unique non-null emails
    const uniqueEmails = [
      ...new Set(rawSales.map((sale) => sale.customer_email).filter(Boolean)),
    ];

    // Fetch user details from the database
    const users =
      uniqueEmails.length > 0
        ? await Account.find(
            { email: { $in: uniqueEmails } },
            "_id username email avatar"
          )
        : [];

    // Convert users array into a dictionary for quick lookup
    const userMap = users.reduce((acc, user) => {
      // @ts-expect-error: no prov
      acc[user.email] = user;
      return acc;
    }, {} as Record<string, { _id: string; username: string; email: string; avatar: string }>);

    // Merge sales data with user details
    const enrichedSales: EnrichedSale[] = rawSales.map((sale) => ({
      ...sale,
      customer: sale.customer_email
        ? userMap[sale.customer_email] || null
        : null,
    }));

    // Prepare response with sales and monthly metrics
    const response: EnrichedSalesResponse = {
      sales: enrichedSales,
      monthlySalesCount,
      monthlyTotalRevenue: Number(monthlyTotalRevenue.toFixed(2)),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
