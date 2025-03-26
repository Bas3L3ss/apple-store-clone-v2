import { type RequestHandler } from "express";
import Account from "../../models/Account";
import { AuthSession } from "../../models/AuthSession";
import { AuthenticatedRequest } from "../../middlewares/check-bearer-token";
import redis from "../../utils/redis";
import crypt from "../../utils/crypt";

const editAccountPassword: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
) => {
  try {
    const user = req.auth;

    if (!user || !user._id) {
      return next({ statusCode: 401, message: "Unauthorized" });
    }

    const existedUser = await Account.findById(user._id);
    if (!existedUser) {
      return next({ statusCode: 401, message: "Unauthorized" });
    }

    const { newPassword, currentPassword, deviceId } = req.body;
    const ok = await crypt.validate(currentPassword, existedUser.password);
    if (!ok) {
      return next({
        statusCode: 400,
        message: "Wrong password, please try again",
      });
    }

    const newHashedPassword = await crypt.hash(newPassword);

    const updatedAccount = await Account.findByIdAndUpdate(
      user._id,
      { $set: { password: newHashedPassword } },
      { new: true, runValidators: true }
    );

    if (!updatedAccount) {
      return next({ statusCode: 404, message: "Account not found" });
    }

    if (!deviceId) {
      await AuthSession.deleteMany({ userId: user._id });
    } else {
      await AuthSession.deleteMany({
        userId: user._id,
        deviceId: { $ne: deviceId },
      });
    }

    redis.publish("user-modified", { userId: updatedAccount._id });

    res.status(200).json({
      success: true,
      message:
        "Account's password updated successfully. Logged out from all other devices.",
      account: updatedAccount,
    });
  } catch (error) {
    next(error);
  }
};

export default editAccountPassword;
