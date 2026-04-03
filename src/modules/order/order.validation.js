import Joi from "joi";

export const addOrderScehma = Joi.object({
  paymentMethod: Joi.string().required().valid("cod", "card"),

  shippingAddress: Joi.object({
    fullName: Joi.string().min(3).max(100).required(),
    phone: Joi.string().required(),
    street: Joi.string().min(3).max(200).required(),
    city: Joi.string().min(2).max(100).required(),
    country: Joi.string().min(2).max(100).required(),
  }).required(),
});
