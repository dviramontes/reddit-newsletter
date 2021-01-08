import { Request, Response } from "express";

export const pingHandler = (req: Request, res: Response) => {
  return res.send("pong");
};

export const apiHandler = (req: Request, res: Response) => {
  return res.send("200 OK;");
};
