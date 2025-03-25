import { Request, Response, NextFunction } from "express";
import jwt from "../../utils/jwt";
import Account from "../../models/Account";
import { APP_URL } from "../../constants";
import redis from "../../utils/redis";

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.query.token as string;
    if (!token) {
      next({
        statusCode: 400,
        message: "Verification token is required",
      });
      return;
    }

    const decoded = await jwt.verifyToken(token);

    if (!decoded?.email) {
      next({ statusCode: 400, message: "Invalid or expired token" });
      return;
    }

    const account = await Account.findOne({ email: decoded.email });

    if (!account) {
      next({ statusCode: 404, message: "User not found" });
      return;
    }

    if (account.verified) {
      next({ statusCode: 400, message: "Email already verified" });
      return;
    }

    account.verified = true;
    await account.save();

    redis.publish("user-modified", {
      userId: account._id,
    });
    res.render("email-verification", {
      frontendURL: APP_URL,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export default verifyEmail;
