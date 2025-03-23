import { NextFunction, Request, Response } from "express";
import { OrderModel } from "../../models/Order";
import redis from "../../utils/redis";

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
      fromDate,
      toDate,
    } = req.query as {
      search?: string;
      status?: string;
      paymentMethod?: string;
      page?: string;
      limit?: string;
      fromDate?: string;
      toDate?: string;
    };

    // Build cache key
    const cacheKey = `orders:${search || ""}:${status || ""}:${
      paymentMethod || ""
    }:${page}:${limit}:${fromDate || ""}:${toDate || ""}`;

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

    // Add text search if present (searching by ObjectId)
    if (search) {
      // Try to match user's ObjectId if it's a valid ObjectId format
      if (/^[0-9a-fA-F]{24}$/.test(search)) {
        filter.userId = search;
      } else {
        // Otherwise, we'll need to populate and search in user details
        // This will be handled after initial query
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

    if (fromDate || toDate) {
      filter.createdAt = {};

      if (fromDate) {
        filter.createdAt.$gte = new Date(fromDate);
      }

      if (toDate) {
        // Set time to end of day for toDate
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let orders = await OrderModel.find(filter)
      .populate({
        path: "userId",
        select: "username email",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

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

    let total = await OrderModel.countDocuments(filter);

    if (search && !/^[0-9a-fA-F]{24}$/.test(search)) {
      total = orders.length;
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
    await redis.set(cacheKey, JSON.stringify(result), 900); // Cache for 15 minutes
    console.log(`✅ Cached ${cacheKey} for 15 minutes`);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in GetOrders:", error);
    next(error);
  }
};
