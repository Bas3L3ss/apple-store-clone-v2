import { type RequestHandler } from "express";
import joi from "../../utils/joi";
import jwt from "../../utils/jwt";
import crypt from "../../utils/crypt";
import Account from "../../models/Account";
import { AuthSession } from "../../models/AuthSession";
import redis from "../../utils/redis";

const login: RequestHandler = async (req, res, next) => {
  try {
    const validationError = await joi.validate(
      {
        email: joi.instance.string().required(),
        password: joi.instance.string().required(),
        deviceId: joi.instance.string().optional(),
        device: joi.instance.object().optional(),
      },
      req.body
    );

    if (validationError) return next(validationError);

    const { email, password, deviceId: unHashedDeviceId, device } = req.body;

    const account = await Account.findOne({ email });

    if (!account) {
      next({ statusCode: 400, message: "Wrong credentials, please retry" });
      return;
    }

    // Verify password hash
    const passOk = await crypt.validate(password, account.password);

    if (!passOk) {
      next({ statusCode: 400, message: "Wrong credentials, please retry" });
      return;
    }

    if (unHashedDeviceId) {
      if (!unHashedDeviceId.trim()) {
        return next({ statusCode: 400, message: "No device ID found" });
      }

      const deviceId = crypt.hashDeviceId(unHashedDeviceId);

      await AuthSession.findOneAndDelete({ deviceId: deviceId });

      const newSession = await AuthSession.create({
        userId: account._id,
        deviceId,
        loggedInAt: new Date(),
        deviceMetadata: {
          deviceType: device.deviceType,
          os: device.os,
          name: device.name,
          ip: device.ip,
        },
      });
      if (account.email) {
        redis.publish(
          "send-email",
          JSON.stringify({
            subject: "User Logged In",
            email: account.email,
            data: {
              ip: device?.ip || "Unknown",
              device: device?.name || "Unknown",
            },
          })
        );
      }
      const token = jwt.signToken({
        sessionId: newSession._id,
        deviceId: newSession.deviceId,
      });

      res.status(200).json({
        message: "Successfully logged-in via session",
        data: account,
        token,
      });
      return;
    }

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
