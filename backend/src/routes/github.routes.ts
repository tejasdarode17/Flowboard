import { Router } from "express";
import { connectGitHubController, getGitHubRepositoriesController, githubCallbackController, linkRepositoryController, } from "../controllers/github.controller";
import { verifyAuth } from "../middlewares/auth.middleware";
import { requireMemberRole, requireWorkspaceAccess } from "../middlewares/workspace.middleware";


const router = Router();
router.get("/:workspaceSlug/connect", verifyAuth, requireWorkspaceAccess, connectGitHubController);
router.get("/callback", githubCallbackController);

router.get("/repos", verifyAuth, getGitHubRepositoriesController);

router.post("/link-repo/:workspaceSlug", verifyAuth, requireWorkspaceAccess, requireMemberRole(["OWNER", "ADMIN"]), linkRepositoryController);



export default router;

