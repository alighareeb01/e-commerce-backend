import { attendanceModel } from "../../database/models/attendance.model.js";
import { staffModel } from "../../database/models/staff.model.js";

export const checkIn = async (req, res) => {
  /**
   * clilciked check in
   * i recieve the req,
   * check if already checked in
   * if checked
   * return already checked
   * else
   * make checkinTime = now
   * if check time after 9
   * isLate is true
   */
  const userId = req.user._id;

  const staff = await staffModel.findOne({ user: userId, isActive: true });
  if (!staff)
    return res.status(404).json({ message: "staff not in the systems" });

  const now = new Date();
  const nineAM = new Date();
  nineAM.setHours(9, 0, 0, 0);

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const attendance = await attendanceModel.findOne({
    user: userId,
    date: { $gte: startOfDay, $lte: endOfDay },
  });
  if (attendance && attendance.checkInTime !== null) {
    return res
      .status(400)
      .json({ message: "already checked in today", attendance });
  }

  const newAttendance = await attendanceModel.create({
    user: userId,
    date: now,
    checkInTime: now,
    isLate: now > nineAM,
  });

  return res
    .status(200)
    .json({ message: "checked in succesfully", newAttendance });
};

export const checkOut = async (req, res) => {
  const userId = req.user._id;
  // console.log(userId);

  const staff = await staffModel.findOne({ user: userId, isActive: true });
  if (!staff)
    return res.status(404).json({ message: "staff not in the systems" });

  // console.log(staff);

  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const attendance = await attendanceModel.findOne({
    user: userId,
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  if (!attendance) {
    return res.status(400).json({ message: "staff did not check in today" });
  }

  if (!attendance.checkInTime) {
    return res.status(400).json({ message: "no data for attenacnde" });
  }

  if (attendance && attendance.checkOutTime) {
    return res.status(400).json({ message: "already checked out today" });
  }

  attendance.checkOutTime = now;

  const workingHours =
    (attendance.checkOutTime - attendance.checkInTime) / (1000 * 60 * 60);

  // if()
  attendance.workingHours = Number(workingHours.toFixed(2));
  // console.log(WorkingHours);
  const dailySalary = staff.dailySalary;
  const perHr = dailySalary / 8;
  const todayPayment = workingHours * perHr;
  let deduction = 0;
  if (workingHours < 8) {
    deduction = (8 - workingHours) * perHr;
  }
  attendance.deduction = deduction;

  await attendance.save();

  return res.json({
    message: "check out successfully",
    attendance: attendance,
  });

  /**
   * daialy balance = 400
   * perHr = daily / 8
   * perHr = 400 /8  = 50
   * Working Hours = work 4 hours
   * todaySalary = workingHoours  * PerHr
   * todaySalary = 4  * 50 = 200
   *
   * deduction = (8 - workingHours) * perHr
   * deduction is (8 - 4 ) * 50= 200
   *
   */
};
