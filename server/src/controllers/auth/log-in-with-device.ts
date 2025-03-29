import { type RequestHandler } from "express";

const loginWithDevice: RequestHandler = async (req, res, next) => {
  try {
    const account = req.auth || {};
    console.log(account);

    if (!account) {
      return next({
        statusCode: 401,
        message: "Not authorized",
      });
    }

    res.status(200).json({
      message: "Succesfully got account",
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

export default loginWithDevice;
