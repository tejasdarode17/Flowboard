import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { requireMemberRole, requireWorkspaceAccess } from "../middlewares/workspace.middleware";
import upload from "../lib/multer";
import { acceptInviteController, createWorkspaceController, getMembersOfWorkspaceController, getWorkspaceDetailsController, getWorkspacesController, inviteMemberController, updateWorkspaceController, validateInviteTokenController } from "../controllers/workspaces.controller";


const route = Router()

route.get("/", verifyAuth, getWorkspacesController);
route.post("/", verifyAuth, upload.single("logo"), createWorkspaceController);
route.patch("/:workspaceSlug", verifyAuth, requireWorkspaceAccess, upload.single("logo"), updateWorkspaceController);
route.get("/:workspaceSlug", verifyAuth, requireWorkspaceAccess, getWorkspaceDetailsController);

// ----------------Members of workspace---------------------
route.get("/:workspaceSlug/members", verifyAuth, requireWorkspaceAccess, getMembersOfWorkspaceController);
route.post("/:workspaceSlug/invite", verifyAuth, requireWorkspaceAccess, requireMemberRole(["OWNER", "ADMIN"]), inviteMemberController);
route.get("/invite/:token", validateInviteTokenController);
route.post("/invite/:token/accept", verifyAuth, acceptInviteController);

export default route


