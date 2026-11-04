import {Router} from "express";
import { authenticationToken } from "../middlewares/auth.middleware.js";
import { checkWorkspaceMembership } from "../middlewares/workspace.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { createCommentController, deleteCommentController, getAllCommentsController, updateCommentController } from "../controllers/comment.controller.js";

const router = Router();

router.post("/:workspaceId/tasks/:taskId/comments", authenticationToken,checkWorkspaceMembership,authorizeRole("ADMIN","EMPLOYEE","MANAGER"), createCommentController)
router.get("/:workspaceId/tasks/:taskId/comments", authenticationToken,checkWorkspaceMembership,authorizeRole("ADMIN","EMPLOYEE","MANAGER"), getAllCommentsController)
router.put("/:workspaceId/tasks/:taskId/comments/:commentId", authenticationToken,checkWorkspaceMembership,authorizeRole("ADMIN","EMPLOYEE","MANAGER"), updateCommentController)
router.delete("/:workspaceId/tasks/:taskId/comments/:commentId", authenticationToken,checkWorkspaceMembership,authorizeRole("ADMIN","EMPLOYEE","MANAGER"), deleteCommentController)

export default router;