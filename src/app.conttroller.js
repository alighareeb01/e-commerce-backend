import express from "express";
import { databaseConnection } from "./database/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/users/user.controller.js";
import categoryRouter from "./modules/category/category.controller.js";
import subCategoryRouter from "./modules/subcategory/subcategory.controller.js";
import productRouter from "./modules/product/product.controller.js";
import cartRouter from "./modules/cart/cart.controller.js";
import orderRouter from "./modules/order/order.controller.js";
import { env } from "../config/env.service.js";

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
  app.use("/uploads", express.static("uploads"));

  app.listen(env.PORT, () => {
    console.log(`serever is running on port ${env.port}`);
  });
};
