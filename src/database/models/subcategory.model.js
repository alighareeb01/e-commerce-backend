import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
    isActive: {
      type: Boolean,
      default: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
  },
  { timestamps: true },
);

export const subCategoriesModel = mongoose.model(
  "subCategories",
  subCategorySchema,
);
