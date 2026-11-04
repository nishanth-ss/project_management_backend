import type { Request, Response } from "express";
import { getActivityLogsService } from "../services/activityLog.service.js";

export const getActivityLogsController = async (req: Request,res: Response)=>{
    try {
        const workspaceId = req.workspace?.workspaceId;
        if(!workspaceId || workspaceId <= 0){
            if (!workspaceId) {
                return res.status(403).json({
                    message: "Workspace access required",
                });
            }
        }
        const logs = await getActivityLogsService(workspaceId);
        return res.status(200).json({
            message: "Successfully fetch activity logs",
            data: logs
        })
    } catch (error) {
        console.error("Failed to fetch comment:", error);

        return res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "Internal server error"
        });
    }
}