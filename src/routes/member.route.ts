import { Router } from "express";

import { addMemberController, getWorkspaceMembersController, removeMemberController, updateMemberRoleController } from "../controllers/member.controller.js";

import { authenticationToken } from "../middlewares/auth.middleware.js";
import { checkWorkspaceMembership } from "../middlewares/workspace.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

const router = Router();

router.post(
    "/:workspaceId/members",
    authenticationToken,
    checkWorkspaceMembership,
    authorizeRole("ADMIN"),
    addMemberController
);

router.get(
    "/:workspaceId/members",
    authenticationToken,
    checkWorkspaceMembership,
    authorizeRole("ADMIN", "MANAGER"),
    getWorkspaceMembersController
);

router.put(
    "/:workspaceId/members/:membershipId/role",
    authenticationToken,
    checkWorkspaceMembership,
    authorizeRole("ADMIN"),
    updateMemberRoleController
);

router.delete(
  "/:workspaceId/members/:membershipId",
  authenticationToken,
  checkWorkspaceMembership,
  authorizeRole("ADMIN"),
  removeMemberController
);

export default router;