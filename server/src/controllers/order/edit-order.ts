import { NextFunction, Request, Response } from "express";
import { OrderModel } from "../../models/Order";
import redis from "../../utils/redis";

export const EditOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId) {
      res.status(404).json({
        message: "OrderId is not found",
      });
      return;
    }

    const UpdatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!UpdatedOrder) {
      res.status(404).json({
        message: "Order not found",
      });
      return;
    }
    redis.publish("user-order-modified", { userId: UpdatedOrder.userId });
    res.status(200).json({
      message: `Sucessfully updated order ${UpdatedOrder._id}'s status`,
    });
  } catch (error) {
    console.error("Error in Edit Order:", error);
    next(error);
  }
};
