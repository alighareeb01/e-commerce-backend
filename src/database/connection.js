import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const databaseConnection = async () => {
  try {
    const DB = process.env.MONGO_URI.replace(
      "<db_password>",
      process.env.MONGO_PASSWORD,
    );

    await mongoose.connect(DB);
    console.log("database connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};
