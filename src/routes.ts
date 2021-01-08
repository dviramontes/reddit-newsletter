import express from "express";
import { pingHandler, apiHandler } from "./handlers";

export const healthCheck = express.Router();

healthCheck.all("/", pingHandler);

export const api = express.Router();

api.get("/ping", apiHandler);
