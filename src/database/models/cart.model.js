import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        itemTotalPrice: {
          type: Number,
          min: 0,
        },
      },
    ],
    cartTotalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

export const cartModel = mongoose.model("cart", cartSchema);
