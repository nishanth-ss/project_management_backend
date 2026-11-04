import {Router} from "express";
import { authenticationToken } from "../middlewares/auth.middleware.js";
import { checkWorkspaceMembership } from "../middlewares/workspace.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { createTaskController, deleteTaskController, getAllTaskController, updateTaskController } from "../controllers/task.controller.js";

const router = Router();

router.post("/:workspaceId/:projectId",authenticationToken,checkWorkspaceMembership,authorizeRole("ADMIN","EMPLOYEE"), createTaskController)
router.get("/:workspaceId/:projectId",authenticationToken,checkWorkspaceMembership,authorizeRole("ADMIN","EMPLOYEE"), getAllTaskController)
router.put("/:workspaceId/:projectId/:id",authenticationToken,checkWorkspaceMembership,authorizeRole("ADMIN","EMPLOYEE"), updateTaskController)
router.delete("/:workspaceId/:projectId/:id",authenticationToken,checkWorkspaceMembership,authorizeRole("ADMIN","EMPLOYEE"), deleteTaskController)

export default router;