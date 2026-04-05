import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

export const env = {
  PORT: process.env.PORT,
  BASE_URL: process.env.BASE_URL,
  MONGO_URI: process.env.MONGO_URI,

  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,

  JWT_VERIFY_SECRET: process.env.JWT_VERIFY_SECRET,
  JWT_RESET_PASSWORD_SECRET: process.env.JWT_RESET_PASSWORD_SECRET,
  JWT_ADMIN_SECRET: process.env.JWT_ADMIN_SECRET,
  JWT_USER_SECRET: process.env.JWT_USER_SECRET,
  JWT_STAFF_SECRET: process.env.JWT_STAFF_SECRET,

  CLOUDINARY_API_NAME: process.env.CLOUDINARY_API_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
