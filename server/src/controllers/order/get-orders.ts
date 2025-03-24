import { NextFunction, Request, Response } from "express";
import { OrderModel } from "../../models/Order";
import redis from "../../utils/redis";
import mongoose from "mongoose";

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      search,
      status,
      paymentMethod,
      page = "1",
      limit = "10",
    } = req.query as {
      search?: string;
      status?: string;
      paymentMethod?: string;
      page?: string;
      limit?: string;
    };

    // Build cache key
    const cacheKey = `orders:${search || ""}:${status || ""}:${
      paymentMethod || ""
    }:${page}:${limit}`;

    // Check cache first
    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
      console.log(`✅ Cache hit for ${cacheKey}`);
      res.status(200).json(cachedResult);
      return;
    }

    console.log(`❌ Cache miss for ${cacheKey}, fetching from database`);

    // Build filter object
    const filter: Record<string, any> = {};

    // Add search for orderId or userId if present (both as ObjectId)
    if (search) {
      // Check if search string is a valid ObjectId format
      if (/^[0-9a-fA-F]{24}$/.test(search)) {
        // Search for either orderId or userId using $or operator
        filter.$or = [
          { _id: new mongoose.Types.ObjectId(search) }, // Search by orderId
          { userId: new mongoose.Types.ObjectId(search) }, // Search by userId
        ];
      } else {
        // We'll handle non-ObjectId searches after the initial query
      }
    }

    // Add status filter if present
    if (status) {
      const statuses = status.split(",").map((s) => s.trim());

      if (statuses.length > 1) {
        filter.status = { $in: statuses };
      } else {
        filter.status = statuses[0];
      }
    }

    if (paymentMethod) {
      const methods = paymentMethod.split(",").map((m) => m.trim());

      if (methods.length > 1) {
        filter.paymentMethod = { $in: methods };
      } else {
        filter.paymentMethod = methods[0];
      }
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let orders = await OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Handle non-ObjectId search (username or email search)
    if (search && !/^[0-9a-fA-F]{24}$/.test(search)) {
      orders = orders.filter(
        (order) =>
          order.userId &&
          ((order.userId as any).username
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
            (order.userId as any).email
              ?.toLowerCase()
              .includes(search.toLowerCase()))
      );
    }

    // Count total documents
    let total;
    if (search && !/^[0-9a-fA-F]{24}$/.test(search)) {
      // For text searches, we need to count filtered results
      total = orders.length;
    } else {
      // For database-level filters, we can use countDocuments
      total = await OrderModel.countDocuments(filter);
    }

    const totalPages = Math.ceil(total / limitNumber);

    const result = {
      success: true,
      data: orders,
      pagination: {
        total,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
      },
    };

    // Cache the result
    await redis.set(cacheKey, result, 900); // Cache for 15 minutes
    console.log(`✅ Cached ${cacheKey} for 15 minutes`);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in GetOrders:", error);
    next(error);
  }
};
