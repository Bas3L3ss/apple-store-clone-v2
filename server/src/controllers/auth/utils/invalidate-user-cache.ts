import redis from "../../../utils/redis";

export const invalidateUserCache = async (
  userId: string,
  isFromAdminEdit: boolean = false
): Promise<void> => {
  try {
    if (!isFromAdminEdit) {
      const cacheKey = `users:${userId}`;
      await redis.del(cacheKey);
    } else {
      const keys = await redis.client.keys("users:*");

      if (keys.length > 0) {
        await redis.client.del(...keys);
        console.log(`✅ Invalidated ${keys.length} users cache keys`);
      }
    }
    console.log(`✅ Invalidated cache for users:${userId}`);
  } catch (error) {
    console.error(`❌ Error invalidating cache for users:${userId}:`, error);
  }
};
