import Joi from "joi";

export const addStaffSchema = Joi.object({
  user: Joi.string().required(),
  dailySalary: Joi.number().min(0).required(),
  department: Joi.string().required(),
  joinDate: Joi.date().optional(),

  monthlyReports: Joi.array()
    .items(
      Joi.object({
        month: Joi.string()
          .pattern(/^\d{4}-\d{2}$/)
          .required(),
        totalDaysWorked: Joi.number().min(0).required(),
        totalDeductions: Joi.number().min(0).required(),
        finalSalary: Joi.number().min(0).required(),
      }),
    )
    .optional(),
});
