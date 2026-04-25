import express from "express";

import { validation } from "../../common/utils/validataion.js";
import { loginSchema, signUpSchema } from "./auth.validation.js";
import { upload } from "../../middleware/multer.js";
import { sendEmail } from "../../common/email/sendEmail.js";
import { auth, checkRole } from "../../middleware/auth.js";
import {
  authSignUp,
  authLogin,
  authVerifyEmail,
  authResendVerification,
  authForgotPassword,
  authResetPassword,
  authSignUpAdmin,
} from "./auth.service.js";

const router = express.Router();

router.post(
  "/signup",
  upload().single("image"),
  validation(signUpSchema),

  authSignUp,
);
router.post("/login", validation(loginSchema), authLogin);

router.post(
  "/signup-admin",
  auth,
  checkRole("super-admin"),
  upload().single("image"),
  validation(signUpSchema),

  authSignUpAdmin,
);


router.get("/verify-email/:token", authVerifyEmail);
router.post("/resend-verification", authResendVerification);

router.post("/forgot-password", authForgotPassword);
router.post("/reset-password/:token", authResetPassword);
export default router;
