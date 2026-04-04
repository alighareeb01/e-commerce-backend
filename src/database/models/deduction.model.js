import mongoose from "mongoose";
const deductionScehma = mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  month: {
    type: String,
    required: true,
  }, // "2024-03"
  amount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  date: Date,
});

export const deductionModel = mongoose.model("deduction", deductionScehma);
