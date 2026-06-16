import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { requireWorkspaceAccess } from "../middlewares/workspace.middleware";
import { getActivitiesController, getRecentActivitiesController } from "../controllers/activity.controller";

const route = Router();

route.get("/:workspaceSlug/activities", verifyAuth, requireWorkspaceAccess, getActivitiesController);
route.get("/:workspaceSlug/recent/activities", verifyAuth, requireWorkspaceAccess, getRecentActivitiesController);

export default route;