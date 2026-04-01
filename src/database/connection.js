import mongoose from "mongoose";

export const databaseConnection = () => {
  mongoose
    .connect("mongodb://localhost:27017/e-commerce")
    .then(() => {
      console.log("database connected successfully");
    })
    .catch((err) => {
      console.error(err);
    });
};
