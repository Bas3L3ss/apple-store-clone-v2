import redis from "../../../utils/redis";

export const invalidateCustomerAnalyticsCache = async (
  email: string
): Promise<void> => {
  if (!email) {
    return console.log("No email to invalidate");
  }
  try {
    const cacheKey = `customer:analytics:${email}`;
    await redis.del(cacheKey);
    console.log(`✅ Invalidated cache for ${cacheKey}`);
  } catch (error) {
    console.error(`❌ Error invalidating cache for ${email}:`, error);
  }
};
