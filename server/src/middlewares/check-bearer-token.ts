import { type RequestHandler, Request, Response, NextFunction } from "express";
import jwt from "../utils/jwt";
import { AuthSession } from "../models/AuthSession";
import Account from "../models/Account";
import crypt from "../utils/crypt";

// Extend Request type to include `auth`
export interface AuthenticatedRequest extends Request {
  auth?: any; // Adjust based on token payload
}

const checkBearerToken: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { deviceId: unHashedDeviceId } = req.body;
    // **1️⃣ Reject if no token or deviceId is provided**
    if (!token && !unHashedDeviceId) {
      return next({
        statusCode: 400,
        message: "Token or deviceId is required",
      });
    }

    // **2️⃣ Handle JWT Token Authentication**
    if (token) {
      const auth = await jwt.verifyToken(token);
      if (!auth) {
        return next({ statusCode: 401, message: "Invalid token" });
      }

      req.auth = auth; // Directly assign the verified token payload
      return next();
    }
    const deviceId = crypt.hashDeviceId(unHashedDeviceId);

    // **3️⃣ Handle Device ID Authentication (Session)**
    const authSession = await AuthSession.findOne({ deviceId });
    if (!authSession) {
      return next({
        statusCode: 401,
        message: "Your session has expired. Please log in again.",
      });
    }

    // Fetch user account
    const auth = await Account.findById(authSession.userId);
    if (!auth) {
      return next({ statusCode: 404, message: "Account not found" });
    }

    req.auth = auth;
    return next();
  } catch (error) {
    return next(error);
  }
};

export default checkBearerToken;
