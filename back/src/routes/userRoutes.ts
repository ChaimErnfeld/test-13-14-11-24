import express from "express";
import { register, login } from "../controllers/auth";

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

// router.route("/candidates").get(isLogin, getCandidates);

export default router;
