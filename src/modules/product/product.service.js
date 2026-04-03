import { productsModel } from "../../database/models/product.model.js";

export const addProduct = async (req, res) => {
  const { name, description, price, stock, category, subcategory } = req.body;

  let productFound = await productsModel.findOne({ name });

  if (productFound)
    return res.status(409).json({ message: "product exists", productFound });

  let imagePath;
  const imagesPaths = [];
  if (req.files) {
    req.files.forEach((el, index) => {
      imagePath = `http://localhost:3000/uploads/${el.filename}`;
      imagesPaths.push(imagePath);
    });
  }

  const prouductObj = {
    name,
    description,
    price,
    stock,
    category,
    subcategory,
    images: imagesPaths,
  };

  if (Number(prouductObj.stock) === 0) {
    prouductObj.isDeleted = true;
    prouductObj.autoDeletedAt = new Date();
  }
  const product = await productsModel.create(prouductObj);
  if (!product)
    return res.status(400).json({ message: "something went wrong" });

  return res
    .status(201)
    .json({ message: "product added successfully", product });
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  let product = await productsModel.findById(id);
  if (!product) return res.status(409).json({ message: "product not found" });

  const { name, description, price, stock, category, subcategory, isDeleted } =
    req.body;

  const existingProduct = await productsModel.findOne({
    name,
    _id: { $ne: id },
  });

  let imagePath;
  const imagesPaths = [];
  if (req.files) {
    req.files.forEach((el, index) => {
      imagePath = `http://localhost:3000/uploads/${el.filename}`;
      imagesPaths.push(imagePath);
      product.images = imagesPaths;
    });
  }

  if (name !== undefined) {
    const existingProduct = await productsModel.findOne({
      name,
      _id: { $ne: id },
    });

    if (existingProduct) {
      return res.json({
        message: "duplcates product name",
      });
    }

    product.name = name;
  }
  if (description) product.description = description;
  if (price) product.price = price;
  if (stock !== undefined) product.stock = stock;
  if (category) product.category = category;
  if (subcategory) product.subcategory = subcategory;
  if (isDeleted == true || isDeleted == false) product.isDeleted = isDeleted;

  if (Number(product.stock) === 0) {
    product.isDeleted = true;
    product.autoDeletedAt = new Date();
  }

  await product.save();

  return res
    .status(201)
    .json({ message: "product updated successfully", product });
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const found = await productsModel.findOne({ _id: id, isDeleted: false });

  if (!found) return res.status(404).json({ message: "product not found" });

  found.isDeleted = true;
  found.deletedAt = new Date();

  await found.save();
  return res.status(201).json({ message: "product deleted successfully" });
};

export const updateStockQuantity = async (req, res) => {
  const { id } = req.params;

  const product = await productsModel.findOne({ _id: id, isDeleted: false });

  if (!product) return res.status(404).json({ message: "product not found" });
  const { stock } = req.body;
  if (stock === undefined) {
    return res.status(400).json({ message: "stock is required" });
  }

  if (Number(stock) < 0) {
    return res.status(400).json({ message: "stock cannot be negative" });
  }

  if (Number(stock) === 0) {
    product.isDeleted = true;
    product.autoDeletedAt = new Date();
    res.json({ message: "stock is 0" });
  }

  product.stock = stock;
  await product.save();

  res.status(201).json({ message: "product stock updated succesfully " });
};

export const getAllActiveProducts = async (req, res) => {
  const products = await productsModel
    .find({ isDeleted: false, isDeleted: false })
    .populate("category")
    .populate("subcategory")
    .select("-createdAt -updatedAt -__v -deletedAt");

  if (products.length === 0)
    return res.status(400).json({ message: "no products found" });

  res.status(201).json({ message: "products", products });
};

export const getProductDetails = async (req, res) => {
  const { id } = req.params;
  const product = await productsModel
    .findById(id)
    .populate("category")
    .populate("subcategory")
    .select("-createdAt -updatedAt -__v -deletedAt");

  if (!product) return res.status(404).json({ message: "prodcut not found" });

  res.status(201).json({ message: "product details", product });
};

export const filterByCategory = async (req, res) => {
  const { categoryId } = req.params;

  const products = await productsModel
    .find({ category: categoryId, isDeleted: false })
    .populate("category")
    .populate("subcategory");
  return res.status(200).json({
    message: "products ",

    products,
  });
};
export const filterBySubCategory = async (req, res) => {
  const { subcategoryId } = req.params;

  const products = await productsModel
    .find({ subcategory: subcategoryId, isDeleted: false })
    .populate("subcategory");
  return res.status(200).json({
    message: "products ",

    products,
  });
};
