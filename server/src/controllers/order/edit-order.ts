import { NextFunction, Request, Response } from "express";
import { OrderModel } from "../../models/Order";
import redis from "../../utils/redis";
import Account from "../../models/Account";

export const EditOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId) {
      res.status(404).json({ message: "OrderId is not found" });
      return;
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Publish to internal event channel
    redis.publish(
      "user-order-modified",
      JSON.stringify({ userId: updatedOrder.userId, orderId, status })
    );

    // Fetch user email for email notification
    const user = await Account.findById(updatedOrder.userId);
    if (user?.email) {
      redis.publish(
        "send-email",
        JSON.stringify({
          subject: "Order Status Changed",
          email: user.email,
          data: { orderId: updatedOrder._id, status },
        })
      );
    } else {
      console.warn("User email not found for order:", updatedOrder._id);
    }

    res.status(200).json({
      message: `Successfully updated order ${updatedOrder._id}'s status`,
    });
  } catch (error) {
    console.error("Error in EditOrder:", error);
    next(error);
  }
};
