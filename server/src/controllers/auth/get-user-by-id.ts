import { NextFunction, Request, Response } from "express";
import Account from "../../models/Account";
import redis from "../../utils/redis";

export const GetUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { uid } = req.params as {
      uid?: string;
    };

    if (!uid) {
      res.status(404).json({
        message: "User not found",
      });

      return;
    }

    const cacheKey = `users:${uid}`;

    // Check cache first
    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
      console.log(`✅ Cache hit for ${cacheKey}`);
      res.status(200).json(cachedResult);
      return;
    }

    console.log(`❌ Cache miss for ${cacheKey}, fetching from database`);

    const user = await Account.find({
      _id: uid,
    }).select("-password");

    // Cache the result
    await redis.set(cacheKey, user, 900); // Cache for 15 minutes
    console.log(`✅ Cached ${cacheKey} for 15 minutes`);

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in GetUsers:", error);
    next(error);
  }
};
