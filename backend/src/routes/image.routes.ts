import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { deleteImage, uploadImage } from "../controllers/image.controller";


const route = Router()

route.post("/image/upload", verifyAuth, uploadImage)
route.delete("/image/delet", verifyAuth, deleteImage)