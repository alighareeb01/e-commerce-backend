import jwt from "jsonwebtoken";
import { userModel } from "./../../database/models/user.model.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../common/email/sendEmail.js";
export const authSignUp = async (req, res) => {
  const { name, email, password, confirmPassword, phone } = req.body;
  const existUser = await userModel.findOne({ email });

  if (existUser)
    return res.status(409).json({ message: "email already exist" });

  if (password != confirmPassword)
    return res.status(400).json({ message: "passwords are not matched" });

  let hashed = await bcrypt.hash(password, 12);

  let avatarPath = "";
  if (req.file) {
    avatarPath = `http://localhost:3000/uploads/${req.file.filename}`;
  }
  console.log(avatarPath);

  let userAdded = await userModel.create({
    name,
    email,
    password: hashed,
    phone,
    avatar: avatarPath,
  });

  let token = jwt.sign({ _id: userAdded._id, role: userAdded.role }, "verify", {
    expiresIn: "20m",
  });

  let verifyLink = `  <button>
      
      <a href="http://localhost:3000/api/v1/auth/verify-email/${token}">verify your account</a>
    </button>`;

  await sendEmail(email, "verify Link", null, verifyLink);

  if (!userAdded)
    return res.status(400).json({ message: "something went wrong" });

  res.status(201).json({ message: "user created successfully", userAdded });
};

export const authLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return res.status(401).json({ message: "user not found" });

  if (!user.isVerified) {
    return res.status(401).json({ message: "verify your email first" });
  }

  if (user.isDeleted) {
    return res.status(403).json({ message: "this account has been deleted" });
  }

  let encrypted = await bcrypt.compare(password, user.password);

  if (!encrypted)
    return res.status(401).json({ message: "incorrect password" });

  let signature = "";

  switch (user.role) {
    case "admin":
      signature = "admin";
      break;
    case "user":
      signature = "user";
      break;
    case "staff":
      signature = "staff";
      break;
    default:
      signature = "user";
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
};

export const authVerifyEmail = async (req, res) => {
  const { token } = req.params;

  let decoded;
  try {
    decoded = jwt.verify(token, "verify");
  } catch (err) {
    return res.status(400).json({ message: " tokenexpired " });
  }

  let exist = await userModel.findById(decoded._id);

  if (!exist) return res.status(404).json({ message: "user not found" });

  if (exist.isVerified == true)
    return res.status(401).json({ message: "already verified" });

  exist.isVerified = true;

  await exist.save();

  res.json({ message: "user verified successfully" });
};

export const authResendVerification = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return res.status(401).json({ message: "user not found" });

  if (user.isVerified == true)
    return res.status(401).json({ message: "already verified" });

  let token = jwt.sign({ _id: user._id, role: user.role }, "verify", {
    expiresIn: "10m",
  });

  let verifyLink = `  <button>
      
      <a href="http://localhost:3000/api/v1/auth/verify-email/${token}">verify your account</a>
    </button>`;

  await sendEmail(email, "verify Link resent", null, verifyLink);

  res.status(200).json({ message: "resent successfully" });
};

export const authForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "user not found" });

    let token = jwt.sign({ _id: user._id, role: user.role }, "resetPassword", {
      expiresIn: "10m",
    });

    let verifyLink = `  <button>
      
      <a href="http://localhost:3000/api/v1/auth/reset-password/${token}">reset your password</a>
    </button>`;

    await sendEmail(email, "reseet your pasword", null, verifyLink);
    return res.status(200).json({ message: "reset link sent successully" });
  } catch (err) {
    console.error(err);
  }
};
export const authResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.json({ message: "passwrods are not matched" });
  }
  let decoded;
  try {
    decoded = jwt.verify(token, "resetPassword");
  } catch (err) {
    return res.status(400).json({ message: " tokenexpired " });
  }

  const user = await userModel.findById(decoded._id);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  let hashed = await bcrypt.hash(password, 12);

  user.password = hashed;
  await user.save();

  res.status(200).json({ message: "password updated correctly" });
};
