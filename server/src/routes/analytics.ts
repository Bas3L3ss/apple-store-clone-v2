import express from "express";
import checkBearerToken from "../middlewares/check-bearer-token";
import checkAdminRole from "../controllers/auth/check-admin-role";
import { GetRevenue } from "../controllers/stripe/get-revenue";
import { GetPaymentStatus } from "../controllers/stripe/get-payment-status";
import { GetRecentSales } from "../controllers/stripe/get-recent-sales";
import { GetTopCustomers } from "../controllers/stripe/get-top-customer";

const router = express.Router();

// ADMIN ONLY:

router.get("/revenue", [checkBearerToken, checkAdminRole, GetRevenue]);
router.get("/payment-status", [
  checkBearerToken,
  checkAdminRole,
  GetPaymentStatus,
]);
router.get("/recent-sales", [checkBearerToken, checkAdminRole, GetRecentSales]);
router.get("/top-customers", [
  checkBearerToken,
  checkAdminRole,
  GetTopCustomers,
]);
export default router;
