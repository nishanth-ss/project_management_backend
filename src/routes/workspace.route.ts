import {Router} from "express";
import { createWorkspaceController, deleteWorkspaceController, getAllWorkspaceController, updateWorkspaceController } from "../controllers/workspace.controller.js";
import { checkWorkspaceMembership } from "../middlewares/workspace.middleware.js";
import { authenticationToken } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

const router = Router();

router.get(
  "/:workspaceId/admin-test",
  authenticationToken,
  checkWorkspaceMembership,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.status(200).json({
      message: "Admin access granted",
      userId: req.user?.userId,
      workspaceId: req.workspace?.workspaceId,
      role: req.workspace?.role
    });
  }
);

router.get(
  "/:workspaceId/test",
  authenticationToken,
  checkWorkspaceMembership,
  (req, res) => {
    res.status(200).json({
      message: "Workspace access granted",
      userId: req.user?.userId,
      workspaceId: req.workspace?.workspaceId,
      role: req.workspace?.role
    });
  }
);

router.post("/create" ,createWorkspaceController);
router.get("/",getAllWorkspaceController);
router.put("/:id",updateWorkspaceController);
router.delete("/:id",deleteWorkspaceController);

export default router;