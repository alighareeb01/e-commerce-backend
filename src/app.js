import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/users/user.controller.js";
import categoryRouter from "./modules/category/category.controller.js";
import subCategoryRouter from "./modules/subcategory/subcategory.controller.js";
import productRouter from "./modules/product/product.controller.js";
import cartRouter from "./modules/cart/cart.controller.js";
import orderRouter from "./modules/order/order.controller.js";
import staffRouter from "./modules/staff/staff.controller.js";
import attendanceRouter from "./modules/attendance/attendance.controller.js";
import deductionRouter from "./modules/deduction/deduction.controller.js";
import salaryRouter from "./modules/salary/salary.controller.js";

import { appError } from "./common/utils/appError.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
import { databaseConnection } from "./database/connection.js";

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json());

app.use(async (req, res, next) => {
  await databaseConnection();
  next();
});
if (process.env.NODE_ENV?.trim() === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1/admin/staff", staffRouter);
app.use("/api/v1/staff", attendanceRouter);
app.use("/api/v1/admin/staff", deductionRouter);
app.use("/api/v1/admin/staff", salaryRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
  });
});

app.all("/*splat", (req, res, next) => {
  next(new appError(`can not find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
