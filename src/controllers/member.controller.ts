import type { Request, Response } from "express";
import { addMemberSchema, updateMemberRoleSchema } from "../validators/member.validator.js";
import { addWorkspaceMember, getWorkspaceMembers, removeWorkspaceMember, updateWorkSpaceMemberRole } from "../services/member.service.js";
import { createActivityService } from "../services/activityLog.service.js";

export const addMemberController = async (
    req: Request,
    res: Response
) => {
    try {
        // 1. Validate request body
        const result = addMemberSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.flatten().fieldErrors
            });
        }

        // 2. Get workspace ID from URL
        const workspaceId = Number(req.workspace?.workspaceId);
        const userId = Number(req.user?.userId);

        if (!Number.isInteger(workspaceId) || workspaceId <= 0 || !Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Workspace ID is required"
            });
        }

        if (!workspaceId) {
            return res.status(403).json({
                message: "Workspace access required"
            });
        }

        // 3. Call service
        const member = await addWorkspaceMember(
            workspaceId,
            result.data
        );

        await createActivityService({
            action: "Member added",
            description: `Member ${member.user.name} was added`,
            userId,
            workspaceId
        })

        // 4. Send success response
        return res.status(201).json({
            message: "Member added successfully",
            data: member
        });

    } catch (error) {
        console.error("Add member error:", error);

        if (
            error instanceof Error &&
            error.message === "A user with this email already exists"
        ) {
            return res.status(409).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getWorkspaceMembersController = async (
    req: Request,
    res: Response
) => {
    try {
        const workspaceId = req.workspace?.workspaceId;

        if (!workspaceId) {
            return res.status(403).json({
                message: "Workspace access required"
            });
        }

        const members = await getWorkspaceMembers(workspaceId);

        return res.status(200).json({
            message: "Workspace members fetched successfully",
            count: members.length,
            data: members
        });

    } catch (error) {
        console.error("Get workspace members error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const updateMemberRoleController = async (req: Request, res: Response) => {
    try {
        const result = updateMemberRoleSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        const workspaceId = Number(req.workspace?.workspaceId);
        const userId = Number(req.user?.userId);
        if (!Number.isInteger(workspaceId) || workspaceId <= 0 || !Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Workspace ID is required"
            });
        }

        const membershipId = Number(req.params.membershipId);

        if (!Number.isSafeInteger(membershipId) || membershipId <= 0) {
            return res.status(400).json({
                message: "Invalid membership ID"
            });
        }

        const updatedMember = await updateWorkSpaceMemberRole(
            workspaceId,
            membershipId,
            result.data.role
        );

        await createActivityService({
            action: "Member updated",
            description: `Workspace member ${updatedMember.user.name} role was changed to ${updatedMember.role}`,
            userId,
            workspaceId
        })

        return res.status(200).json({
            message: "Member role updated successfully",
            data: updatedMember
        });
    } catch (error) {
        console.error("Failed to update membership:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export const removeMemberController = async (
    req: Request,
    res: Response
) => {
    try {
        // 1. Get workspace ID from middleware
        const workspaceId = Number(req.workspace?.workspaceId);
        const userId = Number(req.user?.userId);
        if (!Number.isInteger(workspaceId) || workspaceId <= 0 || !Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Workspace ID is required"
            });
        }

        // 2. Get membership ID from URL
        const membershipId = Number(req.params.membershipId);

        if (!Number.isSafeInteger(membershipId) || membershipId <= 0) {
            return res.status(400).json({
                message: "Invalid membership ID"
            });
        }

        // 3. Get currently logged-in user ID
        const currentUserId = req.user?.userId;

        if (!currentUserId) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        // 4. Call service
        const result = await removeWorkspaceMember(
            workspaceId,
            membershipId,
            currentUserId
        );

        if(!result){
            return res.status(404).json({
                error: "Member not found"
            })
        }

        await createActivityService({
            action: "Member deleted",
            description: `Member ${result.removedMember.name} was deleted`,
            userId,
            workspaceId
        })


        return res.status(200).json({
            message: result.message,
            membershipId: result.membershipId
        });

    } catch (error) {
        console.error("Remove member error:", error);

        if (error instanceof Error) {
            if (error.message === "Member not found in this workspace") {
                return res.status(404).json({ message: error.message });
            }

            if (error.message === "You cannot remove your own membership") {
                return res.status(400).json({ message: error.message });
            }
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};