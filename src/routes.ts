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
  getAllSubredditsHandler,
  patchSubredditTopsHandler,
} from "./handlers";

export const healthCheck = express.Router();

healthCheck.all("/", pingHandler);

export const api = express.Router();

api.get("/subscriptions", getAllSubscriptionsHandler);
api.get("/users", getAllUsersHandler);
api.get("/users/:id", getUserHandler);
api.post("/users", createNewUserHandler);
api.patch("/users/:id", patchUserHandler);
api.delete("/users/:id", deleteUserHandler);
api.post("/users/:id/subs", createSubscriptionHandler);
api.get("/subreddits", getAllSubredditsHandler);
api.patch("/subreddits/:id/tops", patchSubredditTopsHandler);
