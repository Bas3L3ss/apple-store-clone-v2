import { type RequestHandler, Request, Response, NextFunction } from "express";
import jwt from "../utils/jwt";
import Account from "../models/Account";

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
    let { deviceId: deviceIdAndSessionId } = req.body;
    if (!deviceIdAndSessionId) {
      deviceIdAndSessionId = req.query.deviceId;
    }

    if (!token && !deviceIdAndSessionId) {
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
    const parts = deviceIdAndSessionId.split(":");
    const sessionJWT = parts[1];
    if (!sessionJWT) {
      return next({
        statusCode: 401,
        message: "Your session has expired. Please log in again.",
      });
    }
    const decodedJWT = await jwt.verifyToken(sessionJWT);
    const authSession = decodedJWT;

    if (!authSession) {
      return next({
        statusCode: 401,
        message: "Your session has expired. Please log in again.",
      });
    }

    // Fetch user account
    // @ts-expect-error: weird ts quirk
    const auth = await Account.findById(authSession.userId!);
    if (!auth) {
      return next({ statusCode: 404, message: "Account not found" });
    }

    req.auth = auth; // Add deviceId to auth
    return next();
  } catch (error) {
    return next(error);
  }
};

export default checkBearerToken;
