import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "staff"],
      default: "user",
    },
    avatar: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // otp: {
    //   type: Number,
    //   default: null,
    // },
  },
  { timestamps: true },
);

export const userModel = mongoose.model("User", userSchema);
