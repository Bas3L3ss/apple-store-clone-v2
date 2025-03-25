import express from "express";
import checkBearerToken from "../middlewares/check-bearer-token";
import checkAdminRole from "../controllers/auth/check-admin-role";
import { GetRevenue } from "../controllers/stripe/get-revenue";
import { GetPaymentStatus } from "../controllers/stripe/get-payment-status";
import { GetRecentSales } from "../controllers/stripe/get-recent-sales";
import { GetNewCustomersCount } from "../controllers/stripe/get-new-accounts";
import { GetStripeAnalytics } from "../controllers/stripe/get-stripe-analytics";

const router = express.Router();

// ADMIN ONLY:
router.get("/recent-sales", [checkBearerToken, checkAdminRole, GetRecentSales]);
router.get("/revenue", [checkBearerToken, checkAdminRole, GetRevenue]);

router.get("/payment-status", [
  checkBearerToken,
  checkAdminRole,
  GetPaymentStatus,
]);
router.get("/stripe", [checkBearerToken, checkAdminRole, GetStripeAnalytics]);
router.get("/new-customers", [
  checkBearerToken,
  checkAdminRole,
  GetNewCustomersCount,
]);
export default router;
