import express from "express";
import { calMonthlySalary, pay, adjust } from "./salary.service.js";

import { auth, checkRole } from "../../middleware/auth.js";
const router = express.Router();

router.get("/:id/salary/:month", auth, checkRole("admin"), calMonthlySalary);
router.post("/:id/salary/:month/pay", auth, checkRole("admin"), pay);
router.put("/:id/salary/:month/adjust", auth, checkRole("admin"), adjust);

export default router;
