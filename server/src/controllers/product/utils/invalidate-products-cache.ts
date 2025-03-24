import redis from "../../../utils/redis";

export const invalidateProductsCache = async (): Promise<void> => {
  try {
    const keys = await redis.client.keys("products:*");

    if (keys.length > 0) {
      await redis.client.del(...keys);
      console.log(`✅ Invalidated ${keys.length} products cache keys`);
    }
  } catch (error) {
    console.error("❌ Error invalidating products cache:", error);
  }
};
