import express from "express";
import { auth, checkRole } from "../../middleware/auth.js";
import {
  checkout,
  getMyOrders,
  getOrderDetails,
  getALlOrders,
  updateOrderStatus,
} from "./order.service.js";
import { validation } from "../../common/utils/validataion.js";
import { addOrderScehma } from "./order.validation.js";

const router = express.Router();

router.post(
  "/orders/checkout",
  auth,
  checkRole("user"),
  validation(addOrderScehma),
  checkout,
);

router.get("/orders", auth, checkRole("user"), getMyOrders);
router.get("/orders/:id", auth, checkRole("user"), getOrderDetails);

router.get("/admin/orders", auth, checkRole("admin"), getALlOrders);
router.patch(
  "/admin/orders/:id/status",
  auth,
  checkRole("admin"),
  updateOrderStatus,
);
export default router;
