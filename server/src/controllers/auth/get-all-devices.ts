import { type RequestHandler } from "express";
import { AuthenticatedRequest } from "../../middlewares/check-bearer-token";
import { AuthSession } from "../../models/AuthSession";

const getAllDevices: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
) => {
  try {
    const { _id } = req.auth;

    const sessions = await AuthSession.find({ userId: _id });

    res.status(200).json({
      success: true,
      message: "Retrieved all logged-in devices",
      devices: sessions,
    });
  } catch (error) {
    next(error);
  }
};

export default getAllDevices;
