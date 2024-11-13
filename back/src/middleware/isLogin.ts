import { NextFunction, Request, Response } from "express";

export const isLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;

    if (!token) {
      res.status(401).json({ message: "No token", success: false });
      return;
    }

    next();
  } catch (error) {
    res.status(400).json({ message: "error", success: false });
  }
};
