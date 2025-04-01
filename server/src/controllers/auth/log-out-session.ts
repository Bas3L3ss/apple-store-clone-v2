import { type RequestHandler } from "express";
import { AuthenticatedRequest } from "../../middlewares/check-bearer-token";
import { AuthSession } from "../../models/AuthSession";
import redis from "../../utils/redis";
import jwt from "../../utils/jwt";

const LogOutSession: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
) => {
  try {
    const { deviceId: deviceIdAndSessionId } = req.body;
    if (!deviceIdAndSessionId?.trim()) {
      return next({ statusCode: 400, message: "deviceId is required" });
    }

    const parts = deviceIdAndSessionId.split(":");

    const sessionJWT = parts[1];
    if (!sessionJWT) {
      return next({
        statusCode: 404,
        message: "No session found. user is logged out",
      });
    }

    const authSession = await jwt.verifyToken(sessionJWT);

    if (!authSession) {
      res.status(200).json({
        success: true,
        message: "Session is not found",
      });
      return;
    }
    // @ts-expect-error: weird ts quirk
    const session = await AuthSession.findByIdAndDelete(authSession._id);

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
