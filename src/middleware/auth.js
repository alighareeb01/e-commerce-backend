import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const { autherization } = req.headers;

  if (!autherization) {
    return res.status(404).json({ message: "auth is needed" });
  }
  const [bearer, token] = autherization.split(" ");

  let signature = "";

  switch (bearer) {
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
