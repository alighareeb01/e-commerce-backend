import express from "express";
import { auth, checkRole } from "../../middleware/auth.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getAllActiveCategories,
  getSubCategoriesByCategory,
} from "./category.service.js";
import { upload } from "../../middleware/multer.js";
import { validation } from "../../common/utils/validataion.js";
import { categorySchemaValidation } from "./category.validation.js";

const router = express.Router();

router.post(
  "/",
  auth,
  checkRole("admin"),
  upload().single("image"),
  validation(categorySchemaValidation),
  createCategory,
);

router.put(
  "/:id",
  auth,
  checkRole("admin"),
  upload().single("image"),
  updateCategory,
);

router.delete("/:id", auth, checkRole("admin"), deleteCategory);
router.get("/", auth, checkRole("admin"), getAllCategories);
router.get("/getAllActive", getAllActiveCategories);
router.get("/:id/subcategories", getSubCategoriesByCategory);

export default router;
