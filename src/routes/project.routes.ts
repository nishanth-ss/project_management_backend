import { Router } from "express";
import { authenticationToken } from "../middlewares/auth.middleware.js";
import { checkWorkspaceMembership } from "../middlewares/workspace.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { createProjectController, deleteProjectController, getAllProjectsController, updateProjectController } from "../controllers/project.controller.js";

const router = Router();

router.post("/:workspaceId",
    authenticationToken,checkWorkspaceMembership,authorizeRole("ADMIN","MANAGER"),
    createProjectController
);

router.get("/:workspaceId",
    authenticationToken,checkWorkspaceMembership,authorizeRole("ADMIN","MANAGER"),
    getAllProjectsController
);

router.put("/:workspaceId/:id", authenticationToken,checkWorkspaceMembership,authorizeRole("ADMIN","MANAGER"),updateProjectController)
router.delete("/:workspaceId/:id", authenticationToken,checkWorkspaceMembership,authorizeRole("ADMIN","MANAGER"),deleteProjectController)

export default router;