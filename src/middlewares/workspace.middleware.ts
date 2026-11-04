import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";


export const checkWorkspaceMembership = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }
        const workspaceId = Number(req.params.workspaceId);
        if (!Number.isSafeInteger(workspaceId) || workspaceId <= 0) {
            return res.status(400).json({
                message: "Invalid workspace ID"
            });
        }
        const membership = await prisma.membership.findUnique({
            where: {
                userId_workspaceId: {
                    userId,
                    workspaceId
                }
            }
        });

        if (!membership) {
            return res.status(403).json({
                message: "You do not have access to this workspace"
            });
        }

        req.workspace = {
            workspaceId: membership.workspaceId,
            role: membership.role
        };

        return next();
    } catch (error) {
        console.error("Workspace authorization error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}