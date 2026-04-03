import { cartModel } from "../../database/models/cart.model.js";
import { productsModel } from "../../database/models/product.model.js";

export const addToCart = async (req, res) => {
  const { _id } = req.user;
  const { productId, quantity } = req.body;

  const product = await productsModel.findOne({
    _id: productId,
    isDeleted: false,
  });
  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }

  if (quantity > product.stock) {
    return res.status(400).json({
      message: "bigger than num of stock available",
    });
  }

  let cart = await cartModel.findOne({ user: _id });
  if (!cart) {
    cart = await cartModel.create({
      user: _id,
      items: [],
      cartTotalPrice: 0,
    });
  }

  let existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (existingItem) {
    let newQuant = existingItem.quantity + quantity;

    if (newQuant > product.stock) {
      return res.status(400).json({
        message: "bigger than num of stock available",
      });
    }
    existingItem.quantity = newQuant;
    existingItem.price = product.price;
    existingItem.itemTotalPrice = existingItem.quantity * existingItem.price;
  } else {
    let itemObj = {};
    itemObj.product = productId;
    itemObj.quantity = quantity;
    itemObj.price = product.price;
    itemObj.itemTotalPrice = quantity * product.price;
    cart.items.push(itemObj);
  }

  let total = 0;
  cart.items.forEach((el) => {
    total += el.itemTotalPrice;
  });
  cart.cartTotalPrice = total;

  await cart.save();

  res.json({ message: "added to cart", cart });
};

export const viewCart = async (req, res) => {
  const userId = req.user._id;
  const cart = await cartModel
    .findOne({ user: userId })
    .populate("items.product");

  if (!cart) return res.status(404).json({ message: "no cart found" });

  res.status(200).json({ message: "cart", cart });
};

export const updateQuantity = async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;
  const userId = req.user._id;
  let cart = await cartModel.findOne({ user: userId });
  if (!cart) return res.status(404).json({ message: "no cart found" });

  let item = cart.items.find((item) => item.product.toString() === productId);

  if (!item) {
    return res.status(404).json({ message: "item not found in cart" });
  }
  const product = await productsModel.findOne({
    _id: productId,
    isDeleted: false,
  });
  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }

  if (quantity > product.stock)
    return res.json({
      message: " cant updated quantity, bigger than available instock",
    });

  item.quantity = quantity;
  item.itemTotalPrice = quantity * item.price;

  let total = 0;
  cart.items.forEach((el) => {
    total += el.itemTotalPrice;
  });
  cart.cartTotalPrice = total;

  await cart.save();
  res.json({ message: " quantity update succesfullt" });
};

export const deletedItem = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const cart = await cartModel.findOne({ user: userId });

  if (!cart) return res.status(404).json({ message: "cart not found" });

  const oldLength = cart.items.length;

  let item = cart.items.filter((item) => item.product.toString() !== productId);

  if (item.length == oldLength) {
    return res.status(404).json({ message: "item not found in cart" });
  }

  cart.items = item;

  let total = 0;
  cart.items.forEach((el) => {
    total += el.itemTotalPrice;
  });
  cart.cartTotalPrice = total;

  await cart.save();

  res.status(200).json({ message: "item deleted successfully" });
};

export const clearCart = async (req, res) => {
  const userId = req.user._id;
  const cart = await cartModel.findOne({ user: userId });

  if (!cart) return res.status(409).json({ message: "no cart found" });
  cart.items = [];
  cart.cartTotalPrice = 0;

  await cart.save();

  res.status(200).json({ message: "cart cleared succesgully" });
};
