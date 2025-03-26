import { type RequestHandler } from "express";
import { AuthenticatedRequest } from "../../middlewares/check-bearer-token";
import { AuthSession } from "../../models/AuthSession";
import crypt from "../../utils/crypt";
import redis from "../../utils/redis";

const LogOutSession: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
) => {
  try {
    const { deviceId: unHashedDeviceId } = req.body;

    if (!unHashedDeviceId?.trim()) {
      return next({ statusCode: 400, message: "deviceId is required" });
    }

    // Hash deviceId
    const deviceId = crypt.hashDeviceId(unHashedDeviceId);

    // Delete the session and get the deleted document in one query
    const session = await AuthSession.findOneAndDelete({ deviceId });

    if (!session) {
      res.status(200).json({
        success: true,
        message: "Session is not found",
      });
      return;
    }

    // Notify other services about the logout
    redis.publish("user-modified", { userId: session.userId });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default LogOutSession;
