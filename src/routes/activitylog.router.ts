import { Router} from "express";
import { authenticationToken } from "../middlewares/auth.middleware.js";
import { checkWorkspaceMembership } from "../middlewares/workspace.middleware.js";
import { getActivityLogsController } from "../controllers/activitylog.controller.js";

const router = Router();
router.get("/:workspaceId/activity-logs",authenticationToken,checkWorkspaceMembership,getActivityLogsController)

export default router;