import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { getNotificationsController, getUnreadCountController, markAllNotificationsReadController } from "../controllers/notifications.controller";
import { requireWorkspaceAccess } from "../middlewares/workspace.middleware";

const route = Router()

route.get("/:workspaceSlug/notifications", verifyAuth, requireWorkspaceAccess, getNotificationsController);
route.get("/:workspaceSlug/notifications/unread-count", verifyAuth, requireWorkspaceAccess, getUnreadCountController);
route.post("/:workspaceSlug/notifications/read-all", verifyAuth, requireWorkspaceAccess, markAllNotificationsReadController);
export default route