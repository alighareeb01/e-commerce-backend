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
    default:
      signature = env.JWT_USER_SECRET;
      break;
  }
  const decode = jwt.verify(token, signature);
  req.user = decode;

  next();
};

export const checkRole = (role) => (req, res, next) => {
  if (!req.user) return res.json({ message: "unauthorized" });

  if (req.user.role !== role) {
    return res.json("you must be and admin or staff");
  }
  next();
};
