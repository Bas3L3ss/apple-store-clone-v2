import { type RequestHandler } from "express";
import joi from "../../utils/joi";
import jwt from "../../utils/jwt";
import crypt from "../../utils/crypt";
import Account from "../../models/Account";
import { AuthSession } from "../../models/AuthSession";

const login: RequestHandler = async (req, res, next) => {
  try {
    const validationError = await joi.validate(
      {
        email: joi.instance.string().required(),
        password: joi.instance.string().required(),
        deviceId: joi.instance.string().optional(),
      },
      req.body
    );

    if (validationError) return next(validationError);

    const { email, password, deviceId: unHashedDeviceId, device } = req.body;

    // **1️⃣ Find Account (No Session Lookups Here)**
    const account = await Account.findOne({ email });

    if (!account) {
      next({ statusCode: 400, message: "Bad credentials" });
      return;
    }

    // Verify password hash
    const passOk = await crypt.validate(password, account.password);

    if (!passOk) {
      next({ statusCode: 400, message: "Bad credentials" });
      return;
    }

    // **2️⃣ Handle Session-Based Login (Remember Me)**
    if (unHashedDeviceId) {
      if (!unHashedDeviceId.trim()) {
        return next({ statusCode: 400, message: "Invalid Device ID" });
      }

      const deviceId = crypt.hashDeviceId(unHashedDeviceId);
      await AuthSession.create({
        userId: account._id,
        deviceId,
        loggedInAt: new Date(),
        deviceMetadata: {
          deviceType: device.deviceType,
          os: device.os,
          browser: device.browser,
        },
      });

      res.status(200).json({
        message: "Successfully logged-in via session",
        data: account,
      });
      return;
    }

    // **3️⃣ Handle JWT Login (No Remember Me)**
    const token = jwt.signToken({ uid: account._id, role: account.role });

    // Remove password from response data
    const { password: _, ...accountData } = account.toObject();

    res.status(200).json({
      message: "Successfully logged-in",
      data: accountData,
      token,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export default login;
