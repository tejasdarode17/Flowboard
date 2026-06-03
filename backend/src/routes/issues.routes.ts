import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { requireMemberRole, requireWorkspaceAccess } from "../middlewares/workspace.middleware";
import { createIssueController, deleteIssueController, getIssuesController, getMyIssuesController, updateIssueController, } from "../controllers/issues.controller";

const route = Router();

route.post("/:workspaceSlug/projects/:projectId/issues", verifyAuth, requireWorkspaceAccess, createIssueController)
route.get("/:workspaceSlug/projects/:projectId/issues", verifyAuth, requireWorkspaceAccess, getIssuesController)

route.post("/:workspaceSlug/projects/:projectId/issues/:issueId", verifyAuth, requireWorkspaceAccess, updateIssueController);

route.delete("/:workspaceSlug/projects/:projectId/issues/:issueId", verifyAuth, requireWorkspaceAccess, requireMemberRole(["OWNER", "ADMIN"]), deleteIssueController)

route.get("/:workspaceSlug/issues/me", verifyAuth, requireWorkspaceAccess, getMyIssuesController);


export default route;
