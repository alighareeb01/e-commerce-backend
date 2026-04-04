import express from "express";
import { env } from "../config/env.service.js";
import { databaseConnection } from "./database/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/users/user.controller.js";
import categoryRouter from "./modules/category/category.controller.js";
import subCategoryRouter from "./modules/subcategory/subcategory.controller.js";
import productRouter from "./modules/product/product.controller.js";
import cartRouter from "./modules/cart/cart.controller.js";
import orderRouter from "./modules/order/order.controller.js";
import staffRouter from "./modules/staff/staff.controller.js";
import attendanceRouter from "./modules/attendance/attendance.controller.js";

export const bootstrap = () => {
  const app = express();
  app.use(express.json());

  databaseConnection();

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subCategoryRouter);
  app.use("/api/v1", productRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1", orderRouter);
  app.use("/api/v1/admin/staff", staffRouter);
  app.use("/api/v1/staff", attendanceRouter);

  app.use("/uploads", express.static("uploads"));

  app.listen(env.PORT, () => {
    console.log(`serever is running on port ${env.PORT}`);
  });
};
