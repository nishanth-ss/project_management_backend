import type { Request, Response } from "express";
import { taskValidSchema, updateTaskValidSchema } from "../validators/task.validator.js";
import { createTaskService, deleteTaskService, getAllTaskService, updateTaskService } from "../services/task.service.js";
import { createActivityService } from "../services/activityLog.service.js";

export const createTaskController = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.user?.userId);
        const workspaceId = Number(req.params.workspaceId);
        const projectId = Number(req.params.projectId);
        if (
            !Number.isSafeInteger(userId) || userId <= 0 ||
            !Number.isSafeInteger(workspaceId) || workspaceId <= 0 ||
            !Number.isSafeInteger(projectId) || projectId <= 0
        ) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const result = taskValidSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: "validation error",
                details: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            })
        }

        const task = await createTaskService(result.data, projectId, workspaceId);
        await createActivityService({
            action: "Task Created",
            description: `Task ${task.title} was created`,
            userId,
            projectId,
            workspaceId,
            taskId: task.id
        })
        return res.status(201).json({
            message: "Task SuccessFully Created",
            data: task
        })
    } catch (error) {
        console.log("Failed to create task");
        res.status(500).json({
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const getAllTaskController = async (req: Request, res: Response) => {
    try {
        const workspaceId = Number(req.params.workspaceId);
        const data = await getAllTaskService(workspaceId);
        return res.status(200).json({ message: "Successfully fetch all data", data });
    } catch (error) {
        console.log("Failed to create task" + error);
        res.status(500).json({
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const updateTaskController = async (req: Request, res: Response) => {
    try {
        const workspaceId = Number(req.workspace?.workspaceId);
        const userId = Number(req.user?.userId);
        if (!Number.isSafeInteger(userId) || userId <= 0 ||
            !Number.isSafeInteger(workspaceId) || workspaceId <= 0) {
            return res.status(400).json({ message: "Invalid ID or missing authentication" });
        }
        const result = updateTaskValidSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: "validation error",
                details: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            })
        }
        const id = Number(req.params.id);
        const updateTask = await updateTaskService(id, result.data);

        await createActivityService({
            action: "UPDATE",
            userId,
            workspaceId,
            description: `Task ${updateTask?.title} was updated`,
            taskId: id
        })
        return res.status(200).json({
            message: "Task Successfully Updated",
            data: updateTask
        })
    } catch (error) {
        console.log("Failed to update task" + error);
        res.status(500).json({
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const deleteTaskController = async (req: Request, res: Response) => {

    try {
        const id = Number(req.params.id);
        const workspaceId = Number(req.workspace?.workspaceId);
        const userId = Number(req.user?.userId);
        if (!Number.isSafeInteger(userId) || userId <= 0 ||
            !Number.isSafeInteger(workspaceId) || workspaceId <= 0
            || !Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: "Invalid ID or missing authentication" });
        }
        const deleteTask = await deleteTaskService(id);
        await createActivityService({
            action: "DELETE",
            userId,
            workspaceId,
            description: `Task ${deleteTask?.title} was deleted`,
            taskId: id
        })
        return res.status(200).json({
            message: "Task Successfully Deleted",
            data: deleteTask
        })
    } catch (error) {
        console.log("Failed to update task" + error);
        res.status(500).json({
            error: error instanceof Error ? error.message : String(error)
        })
    }
}