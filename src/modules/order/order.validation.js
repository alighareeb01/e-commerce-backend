import Joi from "joi";

const addOrderScehma = Joi.object({
  user: Joi.string().required(),
  product: Joi.string().required(),
  quantity: Joi.number().required().min(1),
  price: Joi.number().required().min(0),
  paymentMethod: Joi.string().required().default("cod"),
  paymentStatus: Joi.string().required().default("pending"),
  orderStatus: Joi.string().required().default("pending"),
  shippingAddress: Joi.object().required(),
});
