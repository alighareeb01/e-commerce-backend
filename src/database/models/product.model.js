import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [5, "name must be at least 5"],
    },
    description: {
      type: String,
      required: true,
      minLength: [5, "desscription must be at least 5"],
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    stock: {
      type: Number,
      min: 0,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategories",
      required: true,
    },
    images: [String],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    autoDeletedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const productsModel = mongoose.model("product", productSchema);
