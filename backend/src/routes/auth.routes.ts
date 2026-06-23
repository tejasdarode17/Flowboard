import { Router } from "express";
import { changeEmailController, changePasswordOtpController, forgetPasswordOtpController, getMe, googleLogin, login, logout, refreshToken, register, resetPasswordController, validateUserController, verifyChangeEmailController, verifyOtpForPasswordCntroller, } from "../controllers/auth.controller";
import { verifyAuth } from "../middlewares/auth.middleware";

const route = Router();

route.post("/register", register)
route.post("/email-verify", validateUserController)
route.post("/login", login);

route.post("/google/login", googleLogin)

route.get("/me", verifyAuth, getMe);


route.get("/refresh", refreshToken);
route.post("/logout", logout);

route.post("/forgot-password", forgetPasswordOtpController);
route.post("/change-password", verifyAuth, changePasswordOtpController);
route.post("/verify-password/otp", verifyOtpForPasswordCntroller)
route.post("/reset-password", resetPasswordController);

route.post("/change-email", verifyAuth, changeEmailController)
route.post("/change-email-verify", verifyAuth, verifyChangeEmailController)

export default route;
