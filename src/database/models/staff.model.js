import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dailySalary: {
      type: Number,
      min: 0,
      required: true,
    },
    joinDate: {
      type: Date,
    },
    department: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    monthlyReports: [
      {
        month: {
          type: String,
          required: true,
        },
        totalDaysWorked: {
          type: Number,
          min: 0,
          required: true,
        },
        totalDeductions: {
          type: Number,
          min: 0,
          required: true,
        },
        finalSalary: {
          type: Number,
          min: 0,
          required: true,
        },
        isPaid: {
          type: Boolean,
          default: false,
        },
        paidAt: { type: Date },
      },
    ],
  },
  { timestamps: true },
);

export const staffModel = mongoose.model("staff", staffSchema);
