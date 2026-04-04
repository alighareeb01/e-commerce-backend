import express from "express";
import {
  addStaff,
  getAllStaff,
  getStaffDetails,
  updateStaffInfo,
  deleteStaff,
} from "./staff.service.js";
import { auth, checkRole } from "../../middleware/auth.js";
import { validation } from "../../common/utils/validataion.js";
import { addStaffSchema } from "./staff.validation.js";

const router = express.Router();

router.post(
  "/",
  auth,
  checkRole("admin"),
  validation(addStaffSchema),
  addStaff,
);

router.get("/", auth, checkRole("admin"), getAllStaff);
router.get("/:id", auth, checkRole("admin"), getStaffDetails);
router.put("/:id", auth, checkRole("admin"), updateStaffInfo);
router.delete("/:id", auth, checkRole("admin"), deleteStaff);

export default router;
