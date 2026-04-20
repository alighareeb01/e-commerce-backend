import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });

import app from "./app.js";
import { databaseConnection } from "./database/connection.js";
import { env } from "../config/env.service.js";
import { socketSetup } from "./socket/socekt.setup.js";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION ...🔥");
  console.log(err.name);
  console.log(err.message);
  process.exit(1);
});

await databaseConnection();

const server = app.listen(env.PORT, () => {
  console.log(`server is running on port ${env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION ...🔥");
  console.log(err.name);
  console.log(err.message);

  server.close(() => {
    process.exit(1);
  });
});

socketSetup(3001);
