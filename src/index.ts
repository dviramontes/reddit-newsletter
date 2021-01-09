import express from "express";
import { api, healthCheck } from "./routes";
import { pool } from "./db";
import bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || "4000";

// middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// obligatory health check
app.use("/ping", healthCheck);

app.use("/api", api);

app.listen(+port);

(async function () {
  const client = await pool.connect();
  const {
    rows: [{ now }],
  } = await client.query("SELECT NOW()");
  console.log(`-- established db connection: ${now}`);
  client.release();
})();

console.log(`-- server running on port: ${port}`);
