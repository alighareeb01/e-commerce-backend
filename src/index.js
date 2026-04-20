import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });

import app from "../src/app.js";
import { databaseConnection } from "../src/database/connection.js";

await databaseConnection();

export default app;
