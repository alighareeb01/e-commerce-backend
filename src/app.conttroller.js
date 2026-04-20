import express from "express";
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
import deductionRouter from "./modules/deduction/deduction.controller.js";
import salaryRouter from "./modules/salary/salary.controller.js";
import { env } from "../config/env.service.js";
import { socketSetup } from "./socket/socekt.setup.js";
import morgan from "morgan";
import { appError } from "./common/utils/appError.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";

export const bootstrap = () => {
  //handling UNCAUGHT EXCEPTIONS
  process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION ...🔥");
    console.log(err.name);
    console.log(err.message);

    process.exit(1);
  });

  const app = express();
  app.use(express.json());

  databaseConnection();

  console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV.trim() === "development") {
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

  //MIDDLEWARE FOR WRONG ROUTES
  app.all("/*splat", (req, res, next) => {
    next(new appError(`can not find ${req.originalUrl} on this server`, 400));
  });

  // Global HANDLE MIDDLEWARE
  app.use(globalErrorHandler);

  const server = app.listen(env.PORT, () => {
    console.log(`serever is running on port ${env.PORT}`);
  });

  // handling UNHANDLED REJECTION
  process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJETION ...🔥");

    console.log(err.name);
    console.log(err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  socketSetup(3001);
};
