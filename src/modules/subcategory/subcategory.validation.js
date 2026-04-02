import Joi from "joi";

export const subcategorySchemaValidation = Joi.object({
  name: Joi.string().min(3).max(10).required(),
  description: Joi.string().min(3).max(30).required(),
  categoryId: Joi.string().required(),
});
