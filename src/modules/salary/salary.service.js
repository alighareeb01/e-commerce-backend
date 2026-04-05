import { attendanceModel } from "../../database/models/attendance.model.js";
import { deductionModel } from "../../database/models/deduction.model.js";
import { staffModel } from "../../database/models/staff.model.js";

export const calMonthlySalary = async (req, res) => {
  try {
    /**
     * get staff
     * get attenedace (id,month)
     * cal workedDaye,lateDays,absetmDays
     * get deduction frkm deductio model
     * cal
     */
    const { id, month } = req.params;

    //   const monthVal = Number(month.split("-")[1]);
    //   console.log(monthVal);

    const staff = await staffModel.findById(id);

    if (!staff) return res.json({ message: "staff not found" });

    const [year, monthNumber] = month.split("-").map(Number);

    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 1);

    const attendances = await attendanceModel.find({
      user: staff.user,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const workedDaye = attendances.filter((a) => !a.isAbsent).length;
    const latDays = attendances.filter((a) => a.isLate).length;
    const absentDays = attendances.filter((a) => a.isAbsent).length;

    const manualDeduction = await deductionModel.find({
      staff: id,
      month,
    });
    // console.log(manualDeduction);
    let sum = 0;
    for (let i = 0; i < manualDeduction.length; i++) {
      sum += manualDeduction[i].amount || 0;
    }

    let adjsutment = 0;
    const baseSalary = staff.dailySalary * workedDaye;
    const deductionCal =
      latDays * (Number(staff.dailySalary || 0) * 0.1) +
      absentDays * Number(staff.dailySalary || 0) +
      sum;
    const finalSalary = baseSalary - deductionCal + adjsutment;
    console.log(finalSalary);

    // console.log(staff);

    let reports = null;
    for (let i = 0; i < staff.monthlyReports.length; i++) {
      if (staff.monthlyReports[i].month == month) {
        staff.monthlyReports[i].totalDaysWorked = workedDaye;
        staff.monthlyReports[i].totalDeductions = deductionCal;
        staff.monthlyReports[i].finalSalary = finalSalary;
        reports = staff.monthlyReports[i];
        break;
      }
    }
    if (!reports) {
      staff.monthlyReports.push({
        month,
        totalDaysWorked: workedDaye,
        totalDeductions: deductionCal,
        finalSalary: finalSalary,
      });
      reports = staff.monthlyReports[staff.monthlyReports.length - 1];
    }
    await staff.save();
    console.log(staff);

    return res.status(200).json({
      message: "monthly salary calculated successfully",
      data: reports,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server err",
      error: error.message,
    });
  }
};

export const pay = async (req, res) => {
  try {
    const { id, month } = req.params;

    const staff = await staffModel.findOne({
      _id: id,
    });

    if (!staff) return res.json({ message: "staff not found" });

    let reports = null;
    for (let i = 0; i < staff.monthlyReports.length; i++) {
      if (staff.monthlyReports[i].month == month) {
        if (staff.monthlyReports[i].isPaid == true) {
          return res.json({ message: "already paid" });
        }
        staff.monthlyReports[i].isPaid = true;
        staff.monthlyReports[i].paidAt = new Date();

        reports = staff.monthlyReports[i];
        break;
      }
    }
    if (!reports) {
      return res.status(404).json({ message: "monthly report not found" });
    }
    await staff.save();
    console.log(staff);
    return res.status(200).json({
      message: "paid sucessfully",
      data: reports,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server err",
      error: error.message,
    });
  }
};

export const adjust = async (req, res) => {
  try {
    const { adjsutment } = req.body;
    const { id, month } = req.params;

    const staff = await staffModel.findOne({
      _id: id,
    });

    if (!staff) return res.json({ message: "staff not found" });

    let reports = null;
    for (let i = 0; i < staff.monthlyReports.length; i++) {
      if (staff.monthlyReports[i].month == month) {
        if (staff.monthlyReports[i].isPaid == true) {
          return res.json({ message: "already got paid" });
        }

        staff.monthlyReports[i].adjustments =
          (Number(staff.monthlyReports[i].adjustments) || 0) +
          Number(adjsutment || 0);

        staff.monthlyReports[i].finalSalary =
          (Number(staff.monthlyReports[i].finalSalary) || 0) +
          Number(adjsutment || 0);

        reports = staff.monthlyReports[i];
        break;
      }
    }
    if (!reports) {
      return res.status(404).json({ message: "monthly report not found" });
    }
    await staff.save();
    console.log(staff);
    return res.status(200).json({
      message: "adjusted salaary sucessfully",
      data: reports,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server err",
      error: error.message,
    });
  }
};
