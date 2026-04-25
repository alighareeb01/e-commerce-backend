import jwt from "jsonwebtoken";
import { env } from "../../config/env.service.js";

export const auth = (req, res, next) => {
  const { autherization } = req.headers;

  if (!autherization) {
    return res.status(404).json({ message: "auth is needed" });
  }
  const [bearer, token] = autherization.split(" ");

  let signature = "";

  switch (bearer) {
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
  const decode = jwt.verify(token, signature);
  req.user = decode;

  next();
};

export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};