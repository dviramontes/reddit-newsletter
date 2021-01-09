import express from "express";
import {
  pingHandler,
  getAllUsersHandler,
  createNewUserHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from "./handlers";

export const healthCheck = express.Router();

healthCheck.all("/", pingHandler);

export const api = express.Router();

api.get("/users", getAllUsersHandler);
api.get("/users/:id", getUserHandler);
api.post("/users", createNewUserHandler);
api.patch("/users/:id", updateUserHandler);
api.delete("/users/:id", deleteUserHandler);
