import { Router } from "express";
import { changeEmailController, changePasswordOtpController, forgetPasswordOtpController, getMe, googleLogin, login, logout, refreshToken, register, resetPasswordController, validateUserController, verifyChangeEmailController, verifyOtpForPasswordCntroller, } from "../controllers/auth.controller";
import { verifyAuth } from "../middlewares/auth.middleware";
import { loginRateLimit } from "../middlewares/rate_limit_middlewares/login_rate_limit.middleware";
import { sendOtpRateLimit } from "../middlewares/rate_limit_middlewares/sendOtp_rate_limit.middleware";
import { verifyOtpRateLimit } from "../middlewares/rate_limit_middlewares/verifyOtp_rate_limit.middleware";
import { resetPasswordRatelimit } from "../middlewares/rate_limit_middlewares/resetPassword_rate_limit.middleware";
import { googleLoginRateLimit } from "../middlewares/rate_limit_middlewares/googleLogin_rate_limit.middleware";

const route = Router();

route.post("/register", sendOtpRateLimit("register"), register)
route.post("/email-verify", verifyOtpRateLimit("register"), validateUserController)
route.post("/login", loginRateLimit, login);

route.post("/google/login", googleLoginRateLimit, googleLogin)

route.get("/me", verifyAuth, getMe);

route.get("/refresh", refreshToken);
route.post("/logout", logout);

route.post("/forgot-password", sendOtpRateLimit("forget-password"), forgetPasswordOtpController);
route.post("/change-password", verifyAuth, sendOtpRateLimit("change-password"), changePasswordOtpController);
route.post("/verify-password/otp", verifyOtpRateLimit("forget-password"), verifyOtpForPasswordCntroller)
route.post("/reset-password", resetPasswordRatelimit, resetPasswordController);

route.post("/change-email", verifyAuth, sendOtpRateLimit("change-email"), changeEmailController)
route.post("/change-email-verify", verifyAuth, verifyOtpRateLimit("change-email"), verifyChangeEmailController)

export default route;
