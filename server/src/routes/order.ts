import express from "express";
import checkBearerToken from "../middlewares/check-bearer-token";
import errorHandler from "../middlewares/error-handler";
import { GetOrderById } from "../controllers/order/get-order-by-id";
import { GetUserOrders } from "../controllers/order/get-user-orders";
import { GetCustomerAnalytics } from "../controllers/stripe/get-customer-analytics";
import checkAdminRole from "../controllers/auth/check-admin-role";
import { GetOrders } from "../controllers/order/get-orders";

const router = express.Router();

// TODO: implement apple card, cod
// ADMIN ONLY:
// GET: Fetch all users orders
router.get(
  "/admin",
  [checkBearerToken, checkAdminRole, GetOrders],
  errorHandler
);

// GET: Fetch all orders of one user
router.get("/", [checkBearerToken, GetUserOrders], errorHandler);

// GET: Fetch user stripe buying analytics
router.get(
  "/analytics",
  [checkBearerToken, GetCustomerAnalytics],
  errorHandler
);

// GET: Fetch a single order by ID
router.get("/:id", [checkBearerToken, GetOrderById], errorHandler);

export default router;
