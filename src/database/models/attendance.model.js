import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  checkInTime: {
    type: Date,
    default: null,
  },

  isLate: {
    type: Boolean,
    default: false,
  },
  isAbsent: {
    type: Boolean,
    default: false,
  },
  checkOutTime: {
    type: Date,
    default: null,
  },
  workingHours: {
    type: Number,
    default: 0,
  },
  deduction: {
    type: Number,
    default: 0,
  },

  date: {
    type: Date,
    required: true,
  },
});

export const attendanceModel = mongoose.model("attendance", attendanceSchema);