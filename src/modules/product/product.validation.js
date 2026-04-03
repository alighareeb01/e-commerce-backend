import Joi from "joi";

export const productSchemaValidation = Joi.object({
  name: Joi.string().min(3).max(10).required(),
  description: Joi.string().min(3).max(30).required(),
  category: Joi.string().required(),
  subcategory: Joi.string().required(),
  price: Joi.number().required().min(0),
  stock: Joi.number().required().min(0),
});
