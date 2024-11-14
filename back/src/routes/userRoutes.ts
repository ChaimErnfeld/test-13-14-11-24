import express from "express";
import { register, login } from "../controllers/auth";
import { getResources, getDetailsOfAmmo } from "../controllers/defance";
import { isLogin } from "../middleware/isLogin";

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/ammo").post(getResources);

router.route("/ammo/:name").get(getDetailsOfAmmo);

export default router;
