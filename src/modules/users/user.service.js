import { userModel } from "../../database/models/user.model.js";

export const userGetProfile = async (req, res) => {
  try {
    const { _id, role } = req.user;

    const user = await userModel
      .findOne({ _id, isDeleted: false })
      .select("-password -isDeleted -role -createdAt -updatedAt -__v -otp");
    if (!user) return res.status(404).json({ message: "user not found" });

    return res.status(200).json({ message: "user", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const userUpdateProfile = async (req, res) => {
  try {
    const { _id, role } = req.user;
    const user = await userModel.findOne({ _id, isDeleted: false });

    if (!user) return res.status(404).json({ message: "user not found" });

    const { name, phone } = req.body;

    //   let avatar;
    //     if (req.file)

    if (req.file) {
      user.avatar = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({ message: "user updated successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const userDeleteProfile = async (req, res) => {
  try {
    const { _id, role } = req.user;
    const user = await userModel.findOne({ _id, isDeleted: false });
    if (!user) return res.status(404).json({ message: "user not found" });

    user.isDeleted = true;
    user.deletedAt = Date.now();
    await user.save();
    return res.status(200).json({ message: "user deleded succsesflyy" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const userUploadAvatar = async (req, res) => {
  try {
    const { _id, role } = req.user;
    const user = await userModel.findOne({ _id, isDeleted: false });
    if (!user) return res.status(404).json({ message: "user not found" });
    if (!req.file) {
      return res.status(404).json({ message: "no avatar found" });
    }
    if (req.file) {
      user.avatar = `http://localhost:3000/uploads/${req.file.filename}`;
    }
    await user.save();

    res.status(200).json({ message: "avaatr uploaded successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
