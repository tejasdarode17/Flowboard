import { Router } from "express";
import { connectGitHubController, getGitHubRepositoriesController, githubCallbackController, linkRepositoryController, unlinkGithubAccountController, unlinkRepositoryController, } from "../controllers/github.controller";
import { verifyAuth } from "../middlewares/auth.middleware";
import { requireMemberRole, requireWorkspaceAccess } from "../middlewares/workspace.middleware";


const router = Router();
router.get("/connect", verifyAuth, connectGitHubController);
router.get("/callback", githubCallbackController);
router.delete("/disconnect", verifyAuth, unlinkGithubAccountController);

router.get("/repos", verifyAuth, getGitHubRepositoriesController);

router.post("/link-repo/:workspaceSlug", verifyAuth, requireWorkspaceAccess, requireMemberRole(["OWNER", "ADMIN"]), linkRepositoryController);
router.delete("/:worskspaceSlug/project/:projectId", verifyAuth, requireWorkspaceAccess, requireMemberRole(["OWNER", "ADMIN"]), unlinkRepositoryController);


export default router;

