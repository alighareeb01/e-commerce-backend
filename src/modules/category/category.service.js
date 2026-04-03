import { categoriesModel } from "../../database/models/category.model.js";
import { userModel } from "../../database/models/user.model.js";

export const createCategory = async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await userModel.findById(_id).select("-isDeleted");

    if (!user) return res.status(404).json({ message: "no account found" });

    const { name, description } = req.body;

    let found = await categoriesModel.findOne({ name, isDeleted: false });
    if (found) return res.json({ message: "category already exist" });

    const newObj = {
      name,
      description,
    };

    let avatar;
    if (req.file) {
      avatar = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    let category = await categoriesModel.create({
      name: name,
      description: description,
      avatar: avatar,
    });

    if (!category)
      return res.status(401).json({ message: "something went wrong" });

    return res
      .status(200)
      .json({ message: "categor added successful", category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoriesModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!category)
      return res.status(404).json({ message: "no category found" });

    const { name, description, isDeleted, isActive } = req.body;

    if (name) category.name = name;
    if (description) category.description = description;
    if (isDeleted == false || isDeleted == true) category.isDeleted = isDeleted;
    if (isActive == false || isActive == true) category.isActive = isActive;

    if (req.file) {
      category.avatar = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    await category.save();

    return res
      .status(200)
      .json({ message: "catrgory updated successfuly", category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoriesModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!category)
      return res.status(404).json({ message: "no category found" });

    category.isDeleted = true;
    category.deletedAt = Date.now();

    await category.save();

    return res.status(200).json({ message: "category deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    let categories = await categoriesModel
      .find({ isDeleted: false })
      .select("-isDeleted -deletedAt -__v")
      .populate("subcategories");

    if (categories.length == 0)
      return res.status(404).json({ message: "no categories found" });

    return res.status(200).json({ message: "categories", categories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const getAllActiveCategories = async (req, res) => {
  try {
    const categories = await categoriesModel.find({
      isActive: true,
      isDeleted: false,
    });

    if (categories.length == 0)
      return res.status(404).json({ message: "no categories found" });

    return res.status(200).json({ message: "categories", categories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
export const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoriesModel
      .findOne({ _id: id, isDeleted: false })
      .populate("subcategories");

    if (!category)
      return res.status(404).json({ message: "no category found" });

    return res.json({ message: "category : subcategroy", category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
