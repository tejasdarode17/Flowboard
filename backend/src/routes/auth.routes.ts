import { Router } from "express";
import { getMe, googleLogin, login, logout, refreshToken, register } from "../controllers/auth.controller";
import { verifyAuth } from "../middlewares/auth.middleware";

const route = Router();

route.post("/register", register);
route.post("/login", login);

route.post("/google/login", googleLogin)

route.get("/me", verifyAuth, getMe);

route.get("/refresh", refreshToken);
route.post("/logout", logout);

export default route;
