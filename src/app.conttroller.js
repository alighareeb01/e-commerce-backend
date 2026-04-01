import express from "express";
import { databaseConnection } from "./database/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/users/user.controller.js";

export const bootstrap = () => {
  const app = express();
  app.use(express.json());

  databaseConnection();

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/uploads", express.static("uploads"));

  app.listen(3000, () => {
    console.log("serever is running on port 3000");
  });
};
