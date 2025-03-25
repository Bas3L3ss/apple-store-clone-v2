import { type RequestHandler } from "express";
import Account from "../../models/Account";
import { AuthenticatedRequest } from "../../middlewares/check-bearer-token";
import redis from "../../utils/redis";
import cloudinary from "../../utils/cloudinary";

const editAccountAdmin: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
) => {
  let uploadedImage: string = "";
  try {
    const { uid } = req.params;
    const user = req.body;

    if (!user || !uid) {
      return next({ statusCode: 401, message: "Missing new user data" });
    }
    const existedUser = await Account.findById(uid);
    if (!existedUser) {
      return next({ statusCode: 404, message: "Account not found" });
    }

    let avatar: File | string | undefined = req.file;

    if (avatar) {
      const newImage = await cloudinary.uploadImages([avatar], "avatar", true);
      console.log(newImage);

      avatar = newImage[0];
      if (avatar) {
        uploadedImage = avatar
          .split("/upload/v")[1]
          .split("/")
          .slice(1)
          .join("/")
          .split(".")[0];
      }
    }

    if (
      (existedUser.avatar &&
        typeof avatar == "string" &&
        avatar != existedUser.avatar) ||
      (existedUser.avatar && req.body.avatar != existedUser.avatar)
    ) {
      const avatarPublicId = existedUser.avatar
        .split("/upload/v")[1]
        .split("/")
        .slice(1)
        .join("/")
        .split(".")[0];

      console.log(avatarPublicId);

      await cloudinary.deleteImage(avatarPublicId);
    }

    const updateData = {
      ...user,
      avatar: avatar ? avatar : req.body.avatar,
    };

    const updatedAccount = await Account.findByIdAndUpdate(
      uid,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedAccount) {
      return next({ statusCode: 404, message: "Account not found" });
    }
    redis.publish("user-modified", {
      userId: updatedAccount._id,
      isFromAdminEdit: true,
    });
    res.status(200).json({
      success: true,
      message: "Account updated successfully",
      account: updatedAccount,
    });
  } catch (error) {
    await cloudinary.deleteImage(uploadedImage);
    next(error);
  }
};

export default editAccountAdmin;
