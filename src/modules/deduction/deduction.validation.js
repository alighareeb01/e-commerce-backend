import Joi from "joi";

export const addDeductuonSchema = Joi.object({
  month: Joi.string()
    .pattern(/^\d{4}-\d{2}$/)
    .required(),
  amount: Joi.number().required(),
  reason: Joi.string().required(),
});
