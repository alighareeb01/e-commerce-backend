import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const databaseConnection = async () => {
  if (cached.conn) return cached.conn;

  const DB = process.env.MONGO_URI.replace(
    "<db_password>",
    process.env.MONGO_PASSWORD,
  );

  if (!cached.promise) {
    cached.promise = mongoose.connect(DB);
  }

  cached.conn = await cached.promise;

  console.log("database connected successfully");

  return cached.conn;
};
