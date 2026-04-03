import express from "express";
import {
  addToCart,
  viewCart,
  updateQuantity,
  deletedItem,
  clearCart,
} from "./cart.service.js";
import { auth, checkRole } from "../../middleware/auth.js";
import { validation } from "../../common/utils/validataion.js";
import { addCartSchema } from "./cart.validation.js";

const router = express.Router();

router.post("/", auth, checkRole("user"), validation(addCartSchema), addToCart);
router.get("/", auth, checkRole("user"), viewCart);
router.put("/:productId", auth, checkRole("user"), updateQuantity);
router.delete("/:productId", auth, checkRole("user"), deletedItem);
router.delete("/", auth, checkRole("user"), clearCart);
export default router;
