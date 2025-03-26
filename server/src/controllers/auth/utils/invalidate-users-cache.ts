import redis from "../../../utils/redis";

export const invalidateUsersCache = async (): Promise<void> => {
  try {
    const keys = await redis.client.keys("users:*");

    if (keys.length > 0) {
      await redis.client.del(...keys);
      console.log(`✅ Invalidated ${keys.length} user cache keys`);
    }
  } catch (error) {
    console.error("❌ Error invalidating user cache:", error);
  }
};
