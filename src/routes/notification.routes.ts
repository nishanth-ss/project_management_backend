import { Router } from "express";
import { authenticationToken } from "../middlewares/auth.middleware.js";
import { checkWorkspaceMembership } from "../middlewares/workspace.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { createNotificationController, deleteNotificationController, getNotificationsController, getUnreadNotificationCountController, markAllNotificationAsReadController, markNotificationAsReadController } from "../controllers/notification.controller.js";
const router = Router();

router.post("/:workspaceId/notification", authenticationToken,checkWorkspaceMembership,authorizeRole("ADMIN","MANAGER"), createNotificationController)
router.get("/:workspaceId/notification", authenticationToken,checkWorkspaceMembership, getNotificationsController)
router.patch("/:workspaceId/notification/read-all", authenticationToken,checkWorkspaceMembership, markAllNotificationAsReadController)
router.patch("/:workspaceId/notification/:id", authenticationToken,checkWorkspaceMembership, markNotificationAsReadController)
router.get("/:workspaceId/notification/un-read", authenticationToken,checkWorkspaceMembership, getUnreadNotificationCountController)
router.delete("/:workspaceId/notification/:id", authenticationToken,checkWorkspaceMembership, deleteNotificationController)

export default router;