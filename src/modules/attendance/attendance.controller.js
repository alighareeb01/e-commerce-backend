import express from "express";
import { auth, checkRole } from "../../middleware/auth.js";
import { checkIn, checkOut } from "./attendance.service.js";

const router = express.Router();

router.post("/checkin", auth, checkRole("staff"), checkIn);
router.post("/checkin", auth, checkRole("staff"), checkOut);

export default router;
