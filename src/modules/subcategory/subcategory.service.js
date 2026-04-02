import { categoriesModel } from "../../database/models/category.model.js";
import { subCategoriesModel } from "../../database/models/subcategory.model.js";
import { userModel } from "../../database/models/user.model.js";

export const createSubCategory = async (req, res) => {
  const { _id } = req.user;

  const user = await userModel.findById(_id).select("-isDeleted");

  if (!user) return res.status(404).json({ message: "no account found" });

  const { name, description, categoryId } = req.body;

  const catFound = await categoriesModel.findOne({
    _id: categoryId,
    isDeleted: false,
  });

  if (!catFound) return res.status(404).json({ message: "category not found" });

  let found = await subCategoriesModel.findOne({ name });
  if (found) return res.json({ message: "subcategory already exist" });

  let avatar;
  if (req.file) {
    avatar = `http://localhost:3000/uploads/${req.file.filename}`;
  }

  let subcategory = await subCategoriesModel.create({
    name: name,
    description: description,
    categoryId,
    avatar: avatar,
  });

  if (!subcategory)
    return res.status(401).json({ message: "something went wrong" });

  return res
    .status(200)
    .json({ message: "subcategor added successful", subcategory });
};

export const updateSubCategory = async (req, res) => {
  const { id } = req.params;

  const subcategory = await subCategoriesModel.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!subcategory)
    return res.status(404).json({ message: "no subcategory found" });

  const { name, description, isDeleted, isActive } = req.body;

  if (name) subcategory.name = name;
  if (description) subcategory.description = description;
  if (isDeleted == false || isDeleted == true)
    subcategory.isDeleted = isDeleted;
  if (isActive == false || isActive == true) subcategory.isActive = isActive;

  if (req.file) {
    subcategory.avatar = `http://localhost:3000/uploads/${req.file.filename}`;
  }

  await subcategory.save();

  return res
    .status(200)
    .json({ message: "catrgory updated successfuly", subcategory });
};

export const deleteSubCategory = async (req, res) => {
  const { id } = req.params;

  const subcategory = await subCategoriesModel.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!subcategory)
    return res.status(404).json({ message: "no subcategory found" });

  subcategory.isDeleted = true;
  subcategory.deletedAt = Date.now();

  await subcategory.save();

  return res.status(200).json({ message: "subcategory deleted successfully" });
};

export const getAllSubCategories = async (req, res) => {
  let subcategories = await subCategoriesModel
    .find({ isDeleted: false })
    .select("-isDeleted")
    .select("-isDeleted -deletedAt -__v");

  if (subcategories.length == 0)
    return res.status(404).json({ message: "no categories found" });

  return res.status(200).json({ message: "subcategories", subcategories });
};

export const getSubCategoryDetails = async (req, res) => {
  const { id } = req.params;

  const subcategory = await subCategoriesModel.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!subcategory)
    return res.status(404).json({ message: "no subcategory found" });

  return res.status(200).json({ message: "subcategory", subcategory });
};
