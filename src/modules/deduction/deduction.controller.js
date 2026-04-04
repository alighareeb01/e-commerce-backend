import express from "express";
import {
  addDeduction,
  getStaffDeductions,
  updateDeduction,
  deleteDeduction,
} from "./deduction.service.js";
import { auth, checkRole } from "../../middleware/auth.js";
import { validation } from "../../common/utils/validataion.js";
import { addDeductuonSchema } from "./deduction.validation.js";

const router = express.Router();

router.post(
  "/:id/deductions",
  auth,
  checkRole("admin"),
  validation(addDeductuonSchema),
  addDeduction,
);
router.get("/:id/deductions", auth, checkRole("admin"), getStaffDeductions);
router.put(
  "/:id/deductions/:deductionId",
  auth,
  checkRole("admin"),
  validation(addDeductuonSchema),
  updateDeduction,
);
router.delete(
  "/:id/deductions/:deductionId",
  auth,
  checkRole("admin"),
  deleteDeduction,
);

export default router;
