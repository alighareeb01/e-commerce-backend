import exress from "express";
import { validation } from "../../common/utils/validataion.js";
import { subcategorySchemaValidation } from "./subcategory.validation.js";
import {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSubCategoryDetails,
} from "./subcategory.service.js";
import { auth, checkRole } from "../../middleware/auth.js";
import { upload } from "../../middleware/multer.js";

const router = exress.Router();

router.post(
  "/",
  auth,
  checkRole("admin"),
  upload().single("image"),
  validation(subcategorySchemaValidation),
  createSubCategory,
);

router.put(
  "/:id",
  auth,
  checkRole("admin"),
  upload().single("image"),
  updateSubCategory,
);

router.delete("/:id", auth, checkRole("admin"), deleteSubCategory);
router.get("/", auth, checkRole("admin"), getAllSubCategories);
router.get("/:id", getSubCategoryDetails);

export default router;
