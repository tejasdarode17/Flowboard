import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { requireWorkspaceAccess } from "../middlewares/workspace.middleware";
import { getProjectActivitiesController, getWorkspaceActivitiesController, } from "../controllers/activity.controller";

const route = Router();

route.get("/:workspaceSlug/activities", verifyAuth, requireWorkspaceAccess, getWorkspaceActivitiesController);
route.get("/:workspaceSlug/projects/:projectId/activities", verifyAuth, requireWorkspaceAccess, getProjectActivitiesController);

export default route;