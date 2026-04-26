import jwt from "jsonwebtoken";
import { userModel } from "./../../database/models/user.model.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../common/email/sendEmail.js";
import { env } from "../../../config/env.service.js";
import { uploadImage } from "../../common/cloudinary/cloudinary.config.js";
import { catchAsync } from "../../common/utils/catchAsync.js";
import { appError } from "../../common/utils/appError.js";

export const authSignUp = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, phone } = req.body;
  const existUser = await userModel.findOne({ email });

  if (existUser) return next(new appError("email already exist", 409));

  if (password != confirmPassword)
    return next(new appError("passwords are not matched", 400));

  let hashed = await bcrypt.hash(password, 12);

  let avatarPath = "";

  if (req.file) {
    // avatarPath = `http://localhost:3000/uploads/${req.file.filename}`;
    let result = await uploadImage(req.file.buffer);
    // console.log(result);
    avatarPath = result.secure_url;
  }

  let userAdded = await userModel.create({
    name,
    email,
    password: hashed,
    phone,
    avatar: avatarPath,
  });

  let token = jwt.sign(
    { _id: userAdded._id, role: userAdded.role },
    env.JWT_VERIFY_SECRET,
    {
      expiresIn: "20m",
    },
  );

  let verifyLink = `  <button>
      
      <a href="http://localhost:3000/api/v1/auth/verify-email/${token}">verify your account</a>
    </button>`;

  await sendEmail(email, "verify Link", null, verifyLink);

  if (!userAdded) return next(new appError("something went wrong", 400));

  res.status(201).json({ message: "user created successfully", userAdded });
});

export const authLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return next(new appError("user not found", 401));

  if (!user.isVerified) {
    return next(new appError("verify your email first", 401));
  }

  if (user.isDeleted) {
    return next(new appError("this account has been deleted", 403));
  }

  let encrypted = await bcrypt.compare(password, user.password);

  if (!encrypted) return next(new appError("incorrect password", 401));

  let signature = "";

  switch (user.role) {
    case "admin":
      signature = env.JWT_ADMIN_SECRET;
      break;
    case "user":
      signature = env.JWT_USER_SECRET;
      break;
    case "staff":
      signature = env.JWT_STAFF_SECRET;
      break;
    case "super-admin":
      signature = env.JWT_SUPER_SECRET;
      break;
    default:
      signature = env.JWT_USER_SECRET;
      break;
  }

  let accessToken = jwt.sign({ _id: user._id, role: user.role }, signature, {
    expiresIn: "24h",
  });
  let refreshToken = jwt.sign({ _id: user._id, role: user.role }, signature, {
    expiresIn: "1y",
  });

  res.status(200).json({
    message: "logged successfull",
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
});

export const authVerifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_VERIFY_SECRET);
  } catch (err) {
    return next(new appError("token expired", 400));
  }

  let exist = await userModel.findById(decoded._id);

  if (!exist) return next(new appError("user not found", 404));

  if (exist.isVerified == true)
    return next(new appError("already verified", 401));

  exist.isVerified = true;

  await exist.save();

  res.json({ message: "user verified successfully" });
});

export const authResendVerification = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new appError("user not found", 401));

  if (user.isVerified == true)
    return next(new appError("already verified", 401));

  let token = jwt.sign(
    { _id: user._id, role: user.role },
    env.JWT_VERIFY_SECRET,
    {
      expiresIn: "10m",
    },
  );

  let verifyLink = `  <button>
      
      <a href="http://localhost:3000/api/v1/auth/verify-email/${token}">verify your account</a>
    </button>`;

  await sendEmail(email, "verify Link resent", null, verifyLink);

  res.status(200).json({ message: "resent successfully" });
});

export const authForgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return next(new appError("user not found", 401));

  let token = jwt.sign(
    { _id: user._id, role: user.role },
    env.JWT_RESET_PASSWORD_SECRET,
    {
      expiresIn: "10m",
    },
  );

  let verifyLink = `  <button>
      
      <a href="http://localhost:3000/api/v1/auth/reset-password/${token}">reset your password</a>
    </button>`;

  await sendEmail(email, "reseet your pasword", null, verifyLink);
  return res.status(200).json({ message: "reset link sent successully" });
});

export const authResetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(new appError("passwords are not matched", 400));
  }
  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_RESET_PASSWORD_SECRET);
  } catch (err) {
    return next(new appError("token expired", 400));
  }

  const user = await userModel.findById(decoded._id);
  if (!user) {
    return next(new appError("user not found", 404));
  }

  let hashed = await bcrypt.hash(password, 12);

  user.password = hashed;
  await user.save();

  res.status(200).json({ message: "password updated correctly" });
});

export const authSignUpAdmin = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, phone } = req.body;

 if (!name) return next(new appError("name is required", 400));
 if (!email) return next(new appError("email is required", 400));
 if (!password) return next(new appError("password is required", 400));
 if (!confirmPassword)
   return next(new appError("confirm password is required", 400));
 if (!phone) return next(new appError("phone is required", 400));

  const existUser = await userModel.findOne({ email });

  if (existUser) {
    return next(new appError("email already exist", 409));
  }

  if (password !== confirmPassword) {
    return next(new appError("passwords are not matched", 400));
  }

  const hashed = await bcrypt.hash(password, 12);

  let avatarPath = "";

  if (req.file) {
    const result = await uploadImage(req.file.buffer);
    avatarPath = result.secure_url;
  }

  const userAdded = await userModel.create({
    name,
    email,
    password: hashed,
    phone,
    avatar: avatarPath,
    role: "admin",
    isVerified: true,
  });

  userAdded.password = undefined;

  res.status(201).json({
    message: "admin created successfully",
    userAdded,
  });
});