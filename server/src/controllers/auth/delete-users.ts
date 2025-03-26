import { Request, Response, NextFunction } from "express";
import Account from "../../models/Account";
import cloudinary from "../../utils/cloudinary";
import redis from "../../utils/redis";

export const deleteUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userIds } = req.body; // Expect an array of user IDs

    if (!Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({ message: "Invalid user IDs" });
      return;
    }

    // Find all users in the given list
    const users = await Account.find({ _id: { $in: userIds } });

    if (users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    // Extract avatar public IDs and delete from Cloudinary
    const avatarPublicIds = users
      .map((user) => user.avatar)
      .filter((avatar) => avatar) // Remove empty avatars
      .map(
        (avatar) =>
          avatar
            ?.split("/upload/v")[1]
            .split("/")
            .slice(1)
            .join("/")
            .split(".")[0]
      );

    if (avatarPublicIds.some((id) => id)) {
      await Promise.all(
        avatarPublicIds
          .filter((id) => id != null || id != undefined)
          .map((id) => cloudinary.deleteImage(id))
      );
    }

    // Bulk delete users
    await Account.deleteMany({ _id: { $in: userIds } });

    redis.publish("user-deleted", {});
    res.status(200).json({
      message: `${users.length} user(s) deleted successfully`,
    });

    return;
  } catch (error) {
    console.error("Error deleting users:", error);
    next(error);
  }
};
