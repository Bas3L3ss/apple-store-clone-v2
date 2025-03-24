import { NextFunction, Request, Response } from "express";
import { fetchAllPayments } from "./fetch-all-payments";

/** Get Successful and Failed Payments */
export async function GetPaymentStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payments = await fetchAllPayments();
    let successfulPayments = 0,
      failedPayments = 0;

    for (const p of payments) {
      if (p.status === "succeeded") {
        successfulPayments++;
      } else if (p.status === "requires_payment_method") {
        failedPayments++;
      }
    }

    res.status(200).json({ successfulPayments, failedPayments });
  } catch (error) {
    next(error);
  }
}
