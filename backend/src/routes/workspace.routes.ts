import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { requireMemberRole, requireWorkspaceAccess } from "../middlewares/workspace.middleware";
import upload from "../lib/multer";
import { acceptInviteController, createWorkspaceController, deleteWorkspaceController, getMembersOfWorkspaceController, getWorkspaceDetailsController, getWorkspacesController, inviteMemberController, removeMemberController, updateMemberRoleController, updateWorkspaceController, validateInviteTokenController } from "../controllers/workspaces.controller";
import { userActionRateLimit } from "../middlewares/rate_limit_middlewares/userAction_rate_limit.middleware";


const route = Router()

route.get("/", verifyAuth, getWorkspacesController);
route.post("/", verifyAuth, userActionRateLimit("upload"), upload.single("logo"), createWorkspaceController);
route.post("/:workspaceSlug", verifyAuth, requireWorkspaceAccess, requireMemberRole(["OWNER", "ADMIN"]), userActionRateLimit("upload"), upload.single("logo"), updateWorkspaceController);
route.get("/:workspaceSlug", verifyAuth, requireWorkspaceAccess, getWorkspaceDetailsController);
route.delete("/:workspaceSlug", verifyAuth, requireWorkspaceAccess, requireMemberRole(["OWNER"]), deleteWorkspaceController);

// ----------------Members of workspace---------------------
route.get("/:workspaceSlug/members", verifyAuth, requireWorkspaceAccess, getMembersOfWorkspaceController);
route.post("/:workspaceSlug/invite", verifyAuth, requireWorkspaceAccess, requireMemberRole(["OWNER", "ADMIN"]), userActionRateLimit("invite"), inviteMemberController);
route.get("/invite/:token", validateInviteTokenController);
route.post("/invite/:token/accept", verifyAuth, acceptInviteController);


route.delete("/:workspaceSlug/members/:memberId", verifyAuth, requireWorkspaceAccess, requireMemberRole(["OWNER", "ADMIN"]), removeMemberController);
route.post("/:workspaceSlug/members/:memberId/role", verifyAuth, requireWorkspaceAccess, requireMemberRole(["OWNER"]), updateMemberRoleController);

export default route


