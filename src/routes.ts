import express from "express";
import {
  pingHandler,
  getAllUsersHandler,
  createNewUserHandler,
  getUserHandler,
  patchUserHandler,
  deleteUserHandler,
  createSubscriptionHandler,
  getAllSubscriptionsHandler,
} from "./handlers";

export const healthCheck = express.Router();

healthCheck.all("/", pingHandler);

export const api = express.Router();

api.get("/subs", getAllSubscriptionsHandler);
api.get("/users", getAllUsersHandler);
api.get("/users/:id", getUserHandler);
api.post("/users", createNewUserHandler);
api.patch("/users/:id", patchUserHandler);
api.delete("/users/:id", deleteUserHandler);
api.post("/users/:id/subs", createSubscriptionHandler);
