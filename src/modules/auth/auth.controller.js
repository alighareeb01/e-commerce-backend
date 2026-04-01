import express from "express";

import { validation } from "../../common/utils/validataion.js";
import { loginSchema, signUpSchema } from "./auth.validation.js";
import { upload } from "../../middleware/multer.js";
import { sendEmail } from "../../common/email/sendEmail.js";
import { auth } from "../../middleware/auth.js";
import {
  authSignUp,
  authLogin,
  authVerifyEmail,
  authResendVerification,
  authForgotPassword,
  authResetPassword,
} from "./auth.service.js";

const router = express.Router();

router.post(
  "/signup",
  upload().single("image"),
  validation(signUpSchema),

  authSignUp,
);
router.post("/login", validation(loginSchema), authLogin);

router.get("/verify-email/:token", authVerifyEmail);
router.post("/resend-verification", authResendVerification);

router.post("/forgot-password", authForgotPassword);
router.post("/reset-password/:token", authResetPassword);
export default router;
