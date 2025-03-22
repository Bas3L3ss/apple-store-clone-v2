import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/check-bearer-token";
import { stripe } from "../../utils/stripe";
import redis from "../../utils/redis";

export async function GetCustomerAnalytics(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.auth;
    if (!email) {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }

    // Create a cache key using the user's email
    const cacheKey = `customer:analytics:${email}`;

    // Try to get analytics from cache first
    const cachedAnalytics = await redis.get(cacheKey);

    if (cachedAnalytics) {
      console.log(`✅ Cache hit for ${cacheKey}`);
      res.status(200).json(cachedAnalytics);
      return;
    }

    console.log(`❌ Cache miss for ${cacheKey}, fetching from Stripe API`);

    const customers = await stripe.customers.list({ email });
    if (!customers.data.length) {
      res.status(404).json({ success: false, message: "Customer not found" });
      return;
    }

    const customer = customers.data[0];

    const payments = await stripe.paymentIntents.list({
      customer: customer.id,
      limit: 100,
    });

    const totalSpent = payments.data.reduce(
      (sum, p) => sum + (p.amount_received || 0),
      0
    );
    const totalOrders = payments.data.length;
    const lastPurchase =
      totalOrders > 0 ? new Date(payments.data[0].created * 1000) : null;

    // Additional analytics that might be useful
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: "card",
    });
    const savedPaymentMethodsCount = paymentMethods.data.length;

    const result = {
      success: true,
      data: {
        totalSpent: totalSpent / 100,
        totalOrders,
        averageOrderValue: (averageOrderValue / 100).toFixed(2),
        lastPurchase,
        savedPaymentMethodsCount,
        customerId: customer.id,
      },
    };

    // Cache the result for 1 hour (3600 seconds)
    // Customer analytics don't change frequently, so a longer TTL is appropriate
    await redis.set(cacheKey, result, 3600);
    console.log(`✅ Cached ${cacheKey} for 1 hour`);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching customer analytics:", error);
    next(error);
  }
}
