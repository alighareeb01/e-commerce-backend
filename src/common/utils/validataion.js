import Joi from "joi";

export const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.json({
        message: "Validation Error",
        details: error.details,
      });
    }
    next();
  };
};
