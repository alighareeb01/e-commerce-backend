import mongoose from "mongoose";
import { env } from "../../config/env.service.js";

export const databaseConnection = () => {
  mongoose
    .connect(`${env.MONGO_URI}`)
    .then(() => {
      console.log("database connected successfully");
    })
    .catch((err) => {
      console.error(err);
    });
};
