import { Request, Response } from "express";
import users from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, organization, district } = req.body;

    const existUser = await users.findOne({ username });

    if (existUser) {
      res.status(400).json({ message: "User already exists", success: false });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      password: hashedPassword,
      organization,
      district,
    };

    await users.create(newUser);

    res.status(200).json({ data: newUser, success: true });
  } catch (error) {
    res.status(400).json({ message: "error", success: false });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const existUser = await users.findOne({ username });

    if (!existUser) {
      res.status(403).json({ message: "User not found", success: false });
      return;
    }

    const decipheredPassword = await bcrypt.compare(password, existUser.password);

    if (!decipheredPassword) {
      res.status(400).json({ message: "Invalid password", success: false });
      return;
    }

    // const token = jwt.sign({ id: existUser._id, isAdmin: existUser.isAdmin }, process.env.JWT_SECRET!, {
    //   expiresIn: "1h",
    // });

    res.status(200).json({ user: existUser, success: true });
  } catch (error) {
    res.status(400).json({ message: "error", success: false });
  }
};
