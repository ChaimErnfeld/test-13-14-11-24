import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;

    if (!token) {
      res.status(401).json({ message: "Unauthorized", success: false });
      return;
    }

    const decodedToken = jwt.verify(token!, process.env.JWT_SECRET!) as JwtPayload;

    if (!decodedToken.isAdmin) {
      res.status(403).json({ message: "Forbidden", success: false });
      return;
    }

    next();
  } catch (error) {
    res.status(400).json({ message: "error", success: false });
  }
};
