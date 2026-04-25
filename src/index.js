import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });

import app from "../src/app.js";

app.use(async (req, res, next) => {
  try {
    await databaseConnection();
    next();
  } catch (err) {
    next(err);
  }
});


export default app;
