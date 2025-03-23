import { NextFunction, Request, Response } from "express";
import Account from "../../models/Account";
import redis from "../../utils/redis";

export const GetUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      search,
      type,
      page = "1",
      limit = "10",
      isVerified = "None",
    } = req.query as {
      search?: string;
      type?: string;
      page?: string;
      limit?: string;
      isVerified?: string;
    };

    // Build cache key including the new isVerified parameter
    const cacheKey = `users:${search || ""}:${
      type || ""
    }:${page}:${limit}:${isVerified}`;

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

    // Add text search if present
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Add type filter if present
    if (type) {
      // Split the type string into an array if it contains commas
      const types = type.split(",").map((t) => t.trim());

      // If there's more than one type, use $in operator
      if (types.length > 1) {
        filter.role = { $in: types };
      } else {
        // For a single type, use direct equality
        filter.role = types[0];
      }
    }

    // Add verification filter if specified
    if (isVerified !== "None") {
      filter.verified = isVerified === "true";
    }

    // Convert pagination values to numbers
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch users with filters and pagination
    const users = await Account.find(filter)
      .select("-password") // Exclude sensitive data
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limitNumber);

    // Count total documents for pagination metadata
    const total = await Account.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNumber);

    const result = {
      success: true,
      data: users,
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
    console.error("Error in GetUsers:", error);
    next(error);
  }
};
