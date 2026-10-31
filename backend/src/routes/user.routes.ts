import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { getUserProfileController, updateProfileController } from "../controllers/user.controller";
import upload from "../lib/multer";
import { userActionRateLimit } from "../middlewares/rate_limit_middlewares/userAction_rate_limit.middleware";

const route = Router();

route.get("/:username", verifyAuth, getUserProfileController);
route.post("/profile/edit", verifyAuth, userActionRateLimit("upload"), upload.single("avatar"), updateProfileController);

export default route