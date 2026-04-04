import { attendanceModel } from "../../database/models/attendance.model.js";
import { deductionModel } from "../../database/models/deduction.model.js";
import { staffModel } from "../../database/models/staff.model.js";

export const addDeduction = async (req, res) => {
  try {
    const { month, reason, amount } = req.body;
    const { id } = req.params;

    const staff = await staffModel.findById(id);
    if (!staff) return res.json({ message: "no staff found" });

    const attendance = await attendanceModel.findOne({ user: staff.user });
    if (!attendance) return res.json({ message: "no attenadce documtn found" });

    //   console.log("-----------------------");

    //   console.log(staff);
    //   console.log("-----------------------");
    //   console.log(attendance);

    const deduction = await deductionModel.create({
      staff: id,
      month: month,
      amount: amount,
      reason,
      date: new Date(),
    });

    let reportExist = staff.monthlyReports.find((report) => {
      return report.month == month;
    });

    if (reportExist != undefined) {
      let totalDeductionsExist = Number(reportExist.totalDeductions) || 0;
      totalDeductionsExist += amount;
      reportExist.totalDeductions = totalDeductionsExist;
    } else {
      staff.monthlyReports.push({
        month: month,
        totalDaysWorked: 0,
        totalDeductions: amount,
        finalSalary: 0,
      });
    }

    await staff.save();
    //   console.log(staff.monthlyReports);

    return res.status(201).json({
      message: "added deduction successfully",
      deduction: deduction,
    });

    //   res.json(staff);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const getStaffDeductions = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await staffModel.findById(id);
    if (!staff) return res.json({ message: "no staff found" });

    const deductions = await deductionModel.find({ staff: id });
    if (!deductions) return res.json({ message: "no dedcution found" });

    return res.json({ deductions: deductions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const updateDeduction = async (req, res) => {
  try {
    const { month, reason, amount } = req.body;

    const { id, deductionId } = req.params;

    const staff = await staffModel.findById(id);
    if (!staff) return res.json({ message: "no staff found" });

    const deduction = await deductionModel.findOne({
      _id: deductionId,
      staff: id,
    });
    if (!deduction) return res.json({ message: "no dedcution found" });

    const oldMonth = deduction.month;
    const oldAmount = Number(deduction.amount) || 0;

    if (amount !== undefined) deduction.amount = amount;
    if (reason !== undefined) deduction.reason = reason;
    if (month !== undefined) deduction.month = month;

    await deduction.save();

    const newMonth = deduction.month;
    const newAmount = Number(deduction.amount) || 0;

    let oldReport = staff.monthlyReports.find((r) => r.month === oldMonth);
    if (oldReport) {
      oldReport.totalDeductions -= oldAmount;
      if (oldReport.totalDeductions < 0) oldReport.totalDeductions = 0;
    }

    let newReport = staff.monthlyReports.find((r) => r.month === newMonth);
    if (newReport) {
      newReport.totalDeductions += newAmount;
    } else {
      staff.monthlyReports.push({
        month: newMonth,
        totalDaysWorked: 0,
        totalDeductions: newAmount,
        finalSalary: 0,
      });
    }
    await staff.save();

    return res.json({
      message: "deduction updated suscessfully",
      deduction: deduction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const deleteDeduction = async (req, res) => {
  try {
    const { id, deductionId } = req.params;

    const staff = await staffModel.findById(id);
    if (!staff) return res.json({ message: "no staff found" });

    const deduction = await deductionModel.findOne({
      _id: deductionId,
      staff: id,
    });
    if (!deduction) return res.json({ message: "no dedcution found" });

    let report = staff.monthlyReports.find((r) => r.month === deduction.month);

    if (report) {
      report.totalDeductions -= Number(deduction.amount) || 0;

      if (report.totalDeductions < 0) {
        report.totalDeductions = 0;
      }
    }

    await staff.save();
    await deduction.deleteOne();
    return res.json({ message: "deleted successfiully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
