import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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
  },
  { timestamps: true },
);
categorySchema.virtual("subcategories", {
  ref: "subCategories",
  localField: "_id",
  foreignField: "categoryId",
  match: { isDeleted: false },
});

categorySchema.set("toJSON", { virtuals: true });
categorySchema.set("toObject", { virtuals: true });

export const categoriesModel = mongoose.model("categories", categorySchema);