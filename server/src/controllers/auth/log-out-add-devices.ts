import { type RequestHandler } from "express";
import { AuthenticatedRequest } from "../../middlewares/check-bearer-token";
import { AuthSession } from "../../models/AuthSession";
import crypt from "../../utils/crypt";

const logOutAllDevices: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
) => {
  try {
    const { _id } = req.auth; // Authenticated user ID
    const { deviceId: unHashedDeviceId } = req.body; // Current device ID (nullable if using JWT)

    if (!unHashedDeviceId?.trim()) {
      return next({
        statusCode: 400,
        message: "deviceId is required to keep the current session active",
      });
    }
    const deviceId = crypt.hashDeviceId(unHashedDeviceId);
    // Delete all auth sessions except the current one
    await AuthSession.deleteMany({ userId: _id, deviceId: { $ne: deviceId } });

    res.status(200).json({
      success: true,
      message: "Logged out from all devices except the current one",
    });
  } catch (error) {
    next(error);
  }
};

export default logOutAllDevices;
