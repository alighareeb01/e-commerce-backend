import { cartModel } from "../../database/models/cart.model.js";
import { orderModel } from "../../database/models/order.model.js";
import { productsModel } from "../../database/models/product.model.js";

export const checkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const { paymentMethod, shippingAddress } = req.body;
    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");

    if (!cart) return res.status(404).json({ message: "not found" });

    if (!cart.items.length) {
      return res.status(400).json({ message: "cart empty" });
    }

    const orderItems = [];
    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];
      const product = item.product;
      if (!product) {
        return res.json({ message: "no prodyct found in cart" });
      }
      if (product.isDeleted) {
        return res.json({
          message: `product is not availabe rn`,
        });
      }
      if (item.quantity > product.stock) {
        return res.status(400).json({
          message: `bigger than theavailable at stock`,
          availabe: product.stock,
        });
      }
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    let total = 0;
    cart.items.forEach((el) => {
      total += el.itemTotalPrice;
    });

    const order = await orderModel.create({
      user: userId,
      items: orderItems,
      totalAmount: total,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      shippingAddress,
    });

    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];
      const product = await productsModel.findById(item.product._id);
      product.stock -= item.quantity;
      await product.save();
    }

    cart.items = [];
    cart.cartTotalPrice = 0;

    await cart.save();

    return res.json({ message: "order created successfully", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await orderModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product");

    if (orders.length == 0) return res.json({ orders: [] });

    res.json({ orders: orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderModel
      .findOne({ _id: id, user: req.user._id })
      .populate("items.product");
    if (!order) return res.json({ message: "no order found" });

    res.json({ messahe: "order", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const getALlOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();

    if (orders.length == 0)
      return res.status(404).json({ message: "no ordders found" });

    res.status(202).json({ message: "orders", orders: orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { orderStatus } = req.body;

    if (
      orderStatus !== "pending" &&
      orderStatus !== "processing" &&
      orderStatus !== "shipped" &&
      orderStatus !== "delivered" &&
      orderStatus !== "cancelled"
    ) {
      return res.json({ messageh: "wrong order status" });
    }

    const order = await orderModel.findById(id);
    if (!order) return res.json({ message: "no order found" });

    order.orderStatus = orderStatus;

    await order.save();

    return res.json({ message: "order status updated", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
