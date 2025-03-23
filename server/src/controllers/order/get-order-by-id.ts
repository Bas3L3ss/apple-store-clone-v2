import { NextFunction, Response } from "express";
import { OrderModel } from "../../models/Order";
import { AuthenticatedRequest } from "../../middlewares/check-bearer-token";
import redis from "../../utils/redis";

export const GetOrderById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { _id: userId, role } = req.auth;

    if (!id) {
      return next({ statusCode: 400, message: "Order ID is required" });
    }

    // Create a cache key based on order ID and user ID
    // Including user ID in the cache key ensures proper authorization
    const cacheKey = `order:${id}:user:${userId}`;

    // Try to get order from cache first
    const cachedOrder = await redis.get(cacheKey);

    if (cachedOrder) {
      console.log(`✅ Cache hit for ${cacheKey}`);
      res.status(200).json(cachedOrder);
      return;
    }

    console.log(`❌ Cache miss for ${cacheKey}, fetching from database`);

    const order = await OrderModel.findById(id).populate({
      path: "items",
      populate: [
        {
          path: "selectedOptions", // Populate selected options
          model: "ProductOption",
        },
        {
          path: "productId", // Populate the actual product details
          model: "Product",
        },
      ],
    });

    if (!order) {
      return next({ statusCode: 404, message: "Order not found" });
    }

    if (order.userId.toString() !== userId.toString()) {
      if (role !== "admin") {
        return next({
          statusCode: 403,
          message: "You are not authorized to view this order",
        });
      }
    }

    const result = { success: true, data: order };

    // Store in cache for future requests (cache for 30 minutes)
    // Orders don't change as frequently as product listings, so a longer TTL is appropriate
    await redis.set(cacheKey, result, 1800);
    console.log(`✅ Cached ${cacheKey} for 30 minutes`);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
