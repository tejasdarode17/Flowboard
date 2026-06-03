import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { requireMemberRole, requireWorkspaceAccess } from "../middlewares/workspace.middleware";
import { createProjectController, getProjectDetailsController, getProjectsController, updateProjectController } from "../controllers/project.controller";


const route = Router()

route.get("/:workspaceSlug/projects", verifyAuth, requireWorkspaceAccess, getProjectsController)
route.post("/:workspaceSlug/projects", verifyAuth, requireWorkspaceAccess, requireMemberRole(["ADMIN", "OWNER"]), createProjectController)
route.patch("/:workspaceSlug/projects/:projectId", verifyAuth, requireWorkspaceAccess, requireMemberRole(["ADMIN", "OWNER"]), updateProjectController)
route.get("/:workspaceSlug/projects/:projectId", verifyAuth, requireWorkspaceAccess, getProjectDetailsController)

export default route