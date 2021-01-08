import express from "express";
import { pingHandler } from "./handlers";

const app = express();
const port = process.env.PORT || "4000";

// obligatory health check
app.get("/ping", pingHandler);

app.listen(+port);

console.log(`server running on port: ${port}`);
