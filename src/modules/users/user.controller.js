import express from "express";
import {
  userGetProfile,
  userUpdateProfile,
  userDeleteProfile,
  userUploadAvatar,
} from "./user.service.js";
import { auth } from "../../middleware/auth.js";
import { upload } from "../../middleware/multer.js";

const router = express.Router();

router.get("/profile", auth, userGetProfile);
router.put("/profile", auth, upload().single("image"), userUpdateProfile);
router.delete("/profile", auth, userDeleteProfile);
router.post("/upload-avatar", auth, upload().single("image"), userUploadAvatar);

export default router;
