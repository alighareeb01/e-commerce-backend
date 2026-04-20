import { uploadImage } from "../../common/cloudinary/cloudinary.config.js";
import { catchAsync } from "../../common/utils/catchAsync.js";
import { productsModel } from "../../database/models/product.model.js";

export const addProduct = catchAsync(async (req, res) => {
  const { name, description, price, stock, category, subcategory } = req.body;

  let productFound = await productsModel.findOne({ name });

  if (productFound)
    return res.status(409).json({ message: "product exists", productFound });

  const imagesPaths = [];
  if (req.files?.length) {
    for (let i = 0; i < req.files.length; i++) {
      const result = await uploadImage(req.files[i].buffer);
      imagesPaths.push(result.secure_url);
    }
    // req.files.forEach((el, index) => {
    //   imagePath = `http://localhost:3000/uploads/${el.filename}`;
    //   imagesPaths.push(imagePath);
    // });
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
});

export const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  let product = await productsModel.findById(id);
  if (!product) return res.status(409).json({ message: "product not found" });

  const { name, description, price, stock, category, subcategory, isDeleted } =
    req.body;

  const existingProduct = await productsModel.findOne({
    name,
    _id: { $ne: id },
  });

  const imagesPaths = [];
  if (req.files?.length) {
    for (let i = 0; i < req.files.length; i++) {
      const result = await uploadImage(req.files[i].buffer);
      imagesPaths.push(result.secure_url);
    }

    product.images = imagesPaths;
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

  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;
  if (category !== undefined) product.category = category;
  if (subcategory !== undefined) product.subcategory = subcategory;
  if (isDeleted == true || isDeleted == false) product.isDeleted = isDeleted;

  if (Number(product.stock) === 0) {
    product.isDeleted = true;
    product.autoDeletedAt = new Date();
  }

  await product.save();

  return res
    .status(201)
    .json({ message: "product updated successfully", product });
});

export const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  const found = await productsModel.findOne({ _id: id, isDeleted: false });

  if (!found) return res.status(404).json({ message: "product not found" });

  found.isDeleted = true;
  found.deletedAt = new Date();

  await found.save();
  return res.status(201).json({ message: "product deleted successfully" });
});

export const updateStockQuantity = catchAsync(async (req, res) => {
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
});

export const getAllActiveProducts = catchAsync(async (req, res) => {
  const queryObj = { ...req.query };
  const excludedField = [
    "page",
    "sort",
    "limit",
    "fields",
    "minPrice",
    "maxPrice",
  ];

  excludedField.forEach((el) => delete queryObj[el]);

  const filterObj = { ...queryObj, isDeleted: false };

  const minPrice = Number(req.query.minPrice);
  const maxPrice = Number(req.query.maxPrice);

  if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
    filterObj.price = {};

    if (!Number.isNaN(minPrice)) filterObj.price.$gte = minPrice;
    if (!Number.isNaN(maxPrice)) filterObj.price.$lte = maxPrice;
  }

  let query = productsModel
    .find(filterObj)
    .populate("category")
    .populate("subcategory")
    .select("-createdAt -updatedAt -__v -deletedAt");

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",");

    // .join(" ");
    console.log(typeof sortBy);

    for (let i = 0; i < sortBy.length; i++) {
      if (sortBy[i] == "price_asc") {
        sortBy[i] = "price";
      } else if (sortBy[i] == "price_dsc") {
        sortBy[i] = "-price";
      }
    }

    // console.log(sortBy);

    query = query.sort(sortBy.join(" "));
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const numOfProducts = await productsModel.countDocuments();
  console.log(numOfProducts);

  if (skip >= numOfProducts) {
    throw new Error("page not exist");
  }
  const products = await query;

  if (products.length === 0)
    return res.status(400).json({ message: "no products found" });

  res.status(201).json({ message: "products", products });
});

export const getProductDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await productsModel
    .findById(id)
    .populate("category")
    .populate("subcategory")
    .select("-createdAt -updatedAt -__v -deletedAt");

  if (!product) return res.status(404).json({ message: "prodcut not found" });

  res.status(201).json({ message: "product details", product });
});

export const filterByCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const queryObj = { ...req.query };

  const excludedField = [
    "page",
    "sort",
    "limit",
    "fields",
    "minPrice",
    "maxPrice",
  ];
  excludedField.forEach((el) => delete queryObj[el]);
  const filterObj = { ...queryObj, isDeleted: false, category: categoryId };

  const minPrice = Number(req.query.minPrice);
  const maxPrice = Number(req.query.maxPrice);

  if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
    filterObj.price = {};

    if (!Number.isNaN(minPrice)) filterObj.price.$gte = minPrice;
    if (!Number.isNaN(maxPrice)) filterObj.price.$lte = maxPrice;
  }

  let query = productsModel
    .find(filterObj)
    .populate("category")
    .populate("subcategory");

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const numOfProducts = await productsModel.countDocuments();
  console.log(numOfProducts);

  if (skip >= numOfProducts) {
    throw new Error("page not exist");
  }

  const products = await query;

  return res.status(200).json({
    message: "products ",

    products,
  });
});

export const filterBySubCategory = catchAsync(async (req, res) => {
  const { subcategoryId } = req.params;

  const queryOBj = [...req.query];

  const excludedField = [
    "page",
    "sort",
    "limit",
    "fields",
    "minPrice",
    "maxPrice",
  ];
  excludedField.forEach((el) => delete queryOBj[el]);
  const filterObj = {
    ...queryOBj,
    isDeleted: false,
    subcategory: subcategoryId,
  };

  const minPrice = Number(req.query.minPrice);
  const maxPrice = Number(req.query.maxPrice);

  if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
    filterObj.price = {};

    if (!Number.isNaN(minPrice)) filterObj.price.$gte = minPrice;
    if (!Number.isNaN(maxPrice)) filterObj.price.$lte = maxPrice;
  }

  let query = productsModel
    .find(filterObj)
    .find({ subcategory: subcategoryId, isDeleted: false })
    .populate("subcategory");

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const numOfProducts = await productsModel.countDocuments();
  console.log(numOfProducts);

  if (skip >= numOfProducts) {
    throw new Error("page not exist");
  }

  const products = await query;

  return res.status(200).json({
    message: "products ",

    products,
  });
});
