import { NextFunction, Request, Response } from "express";
import { ProductModel } from "../../models/Product";
import redis from "../../utils/redis";

export const GetProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      search,
      category,
      page = "1",
      limit = "10",
    } = req.query as {
      search?: string;
      category?: string;
      page?: string;
      limit?: string;
    };

    const cacheKey = `products:${search || ""}:${
      category || ""
    }:${page}:${limit}`;

    const cachedResult = await redis.get(cacheKey);

    if (cachedResult) {
      console.log(`✅ Cache hit for ${cacheKey}`);
      res.status(200).json(cachedResult);
      return;
    }

    console.log(`❌ Cache miss for ${cacheKey}, fetching from database`);

    const filter: Record<string, any> = {};

    // Full-text search on name & description
    if (search) {
      filter.$text = { $search: search };
    }

    // Handle multiple categories
    if (category) {
      // Split the category string into an array if it contains commas
      const categories = category.split(",").map((cat) => cat.trim());

      // If there's more than one category, use $in operator
      if (categories.length > 1) {
        filter.category = { $in: categories };
      } else {
        // For a single category, use direct equality
        filter.category = categories[0];
      }
    }

    // Convert pagination values to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch products with filters, pagination, and population
    const products = await ProductModel.find(filter)
      .populate("productOptions")
      .skip(skip)
      .limit(limitNumber);

    // Count total documents for pagination metadata
    const total = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNumber);

    const result = {
      success: true,
      data: products,
      pagination: {
        total,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
      },
    };

    await redis.set(cacheKey, result, 900);
    console.log(`✅ Cached ${cacheKey} for 15 minutes`);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in GetProducts:", error);
    next(error);
  }
};
