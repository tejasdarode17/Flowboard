import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { getUserProfileController, updateProfileController } from "../controllers/user.controller";
import upload from "../lib/multer";

const route = Router();

route.get("/:username", verifyAuth, getUserProfileController);
route.post("/profile/edit", verifyAuth, upload.single("avatar"), updateProfileController);

export default route