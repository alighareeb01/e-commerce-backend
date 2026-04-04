import { staffModel } from "../../database/models/staff.model.js";
import { userModel } from "../../database/models/user.model.js";

export const addStaff = async (req, res) => {
  try {
    const { user, dailySalary, department, joinDate } = req.body;

    const userExist = await userModel.findById(user);

    if (!userExist) return res.status(404).json({ message: " user not found" });

    const alreadyStaff = await staffModel.findOne({ user });
    if (alreadyStaff)
      return res.status(401).json({ message: "staff already exist" });

    const staff = await staffModel.create({
      user,
      dailySalary,
      department,
      joinDate,
    });
    userExist.role = "staff";
    await userExist.save();

    return res.status(200).json({ message: "staff member added", staff });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const staff = await staffModel.find().populate("user");

    if (!staff.length)
      return res.status(404).json({ message: "no staff found" });

    return res.status(200).json({ staff: staff });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const getStaffDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await staffModel.findById(id).populate("user");
    if (!staff) return res.status(404).json({ message: "staff not found" });

    return res.status(200).json({ staff: staff });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const updateStaffInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await staffModel.findById(id).populate("user");
    if (!staff) return res.status(404).json({ message: "staff not found" });
    const { dailySalary, department } = req.body;
    if (dailySalary !== undefined) staff.dailySalary = dailySalary;
    if (department !== undefined) staff.department = department;

    await staff.save();
    return res
      .status(200)
      .json({ message: "staff updated sucessfully", staff: staff });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const deleteStaff = async (req, res) => {
  const { id } = req.params;

  const staff = await staffModel.findById(id);
  if (!staff) return res.status(404).json({ message: "staff not found" });

  if (!staff.isActive) {
    return res.json({ message: "staff already deleted" });
  }
  staff.isActive = false;
  await staff.save();

  return res.status(200).json({ message: "staff ddeleted sucessfully" });
};
