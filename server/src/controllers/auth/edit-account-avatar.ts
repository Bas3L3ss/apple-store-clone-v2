import { type RequestHandler } from "express";
import Account from "../../models/Account";
import { AuthenticatedRequest } from "../../middlewares/check-bearer-token";
import redis from "../../utils/redis";
import cloudinary from "../../utils/cloudinary";

const editAccountAvatar: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
) => {
  let newImagePublicId: string = "";
  try {
    const user = req.auth;

    if (!user || !user._id) {
      return next({ statusCode: 401, message: "Unauthorized" });
    }

    const existedUser = await Account.findById(user._id);
    if (!existedUser) {
      return next({ statusCode: 401, message: "Unauthorized" });
    }

    // @ts-expect-error: no prob
    let avatar: string | File | undefined = req.file;

    if (avatar) {
      const newImage = await cloudinary.uploadImages([avatar], "avatar", true);
      if (newImage.length != 1) {
        throw new Error("Couldn't upload image");
      }
      avatar = newImage[0];
      if (avatar) {
        newImagePublicId = avatar
          .split("/upload/v")[1]
          .split("/")
          .slice(1)
          .join("/")
          .split(".")[0];
      }
    } else {
      return next({ statusCode: 404, message: "No avatar is found" });
    }

    if (existedUser.avatar && existedUser.avatar != avatar) {
      const avatarPublicId = existedUser.avatar
        .split("/upload/v")[1]
        .split("/")
        .slice(1)
        .join("/")
        .split(".")[0];

      await cloudinary.deleteImage(avatarPublicId);
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      user._id,
      { $set: { avatar } },
      { new: true, runValidators: true }
    );

    if (!updatedAccount) {
      return next({ statusCode: 404, message: "Account not found" });
    }
    redis.publish("user-modified", { userId: updatedAccount._id });
    res.status(200).json({
      success: true,
      message: "Account's avatar updated successfully",
      account: updatedAccount,
    });
  } catch (error) {
    await cloudinary.deleteImage(newImagePublicId);
    next(error);
  }
};

export default editAccountAvatar;
