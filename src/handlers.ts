import { Request, Response } from "express";
import { fetchPosts } from "./reddit";

export const pingHandler = (req: Request, res: Response) => {
  return res.send("pong");
};

export const apiHandler = async (req: Request, res: Response) => {
  const result = await fetchPosts("worldnews");

  if (result.isOk()) {
    console.log(result.value);
  }

  if (result.isErr()) {
    console.log(result.error);
  }

  return res.send({});
};
