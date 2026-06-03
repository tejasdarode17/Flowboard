import { Router } from "express";
import { connectGitHubController, getGitHubRepositoriesController, githubCallbackController, linkRepositoryController, } from "../controllers/github.controller";
import { verifyAuth } from "../middlewares/auth.middleware";
import { requireWorkspaceAccess } from "../middlewares/workspace.middleware";

const router = Router();

router.get("/:workspaceSlug/connect", verifyAuth, requireWorkspaceAccess, connectGitHubController);
router.get("/callback", githubCallbackController);

router.get("/repos", verifyAuth, getGitHubRepositoriesController);
router.post("/link-repo", verifyAuth, linkRepositoryController);

export default router;