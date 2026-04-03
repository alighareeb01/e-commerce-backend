import express from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  updateStockQuantity,
  getAllActiveProducts,
  getProductDetails,
  filterByCategory,
  filterBySubCategory,
} from "./product.service.js";
import { auth, checkRole } from "../../middleware/auth.js";
import { validation } from "../../common/utils/validataion.js";
import { productSchemaValidation } from "./product.validation.js";
import { upload } from "../../middleware/multer.js";

const router = express.Router();

router.post(
  "/admin/products",
  auth,
  checkRole("admin"),
  upload().array("images", 5),
  validation(productSchemaValidation),
  addProduct,
);

router.put(
  "/admin/products/:id",
  auth,
  checkRole("admin"),
  upload().array("images", 5),
  // validation(productSchemaValidation),
  updateProduct,
);

router.delete("/admin/products/:id", auth, checkRole("admin"), deleteProduct);
router.patch(
  "/admin/products/:id/stock",
  auth,
  checkRole("admin"),
  updateStockQuantity,
);

router.get("/products", getAllActiveProducts);
router.get("/products/:id", getProductDetails);
router.get("/products/category/:categoryId", filterByCategory);
router.get("/products/subcategory/:subcategoryId", filterBySubCategory);

export default router;
