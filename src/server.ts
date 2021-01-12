import express from "express";
import { api, healthCheck } from "./routes";
import { pingDatabase } from "./db";
import bodyParser = require("body-parser");

export async function runApiServer() {
  const app = express();
  const port = process.env.PORT || "4000";

  // middleware
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));

  // obligatory health check
  app.use("/ping", healthCheck);

  app.use("/api", api);

  app.listen(+port);

  await pingDatabase();

  console.log(`-- server running on port: ${port}`);
}
