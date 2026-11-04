import type { Request, Response } from "express";
import { projectValidSchema, updateValidSchema } from "../validators/project.validator.js";
import { createProjectService, deleteProjectService, getAllProjectsService, updateProjectService } from "../services/project.service.js";
import { createActivityService } from "../services/activityLog.service.js";


export const createProjectController = async (req: Request, res: Response) => {
    try {
        const workspaceId = Number(req.workspace?.workspaceId);
        const userId = Number(req.user?.userId);
        if (!Number.isInteger(workspaceId) || workspaceId <= 0) {
            return res.status(400).json({
                message: "Workspace ID is required"
            });
        }
        const result = projectValidSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            })
        }

        const project = await createProjectService(result.data, workspaceId);
        await createActivityService({
            action: "Project Created",
            description: `Project ${project.name} was created`,
            userId,
            projectId: project.id,
            workspaceId
        })

        return res.status(201).json({
            message: "Project created successfully",
            data: project
        });
    } catch (error) {
        console.error("Failed to create user:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export const getAllProjectsController = async (req: Request, res: Response) => {
    try {
        const result = await getAllProjectsService();
        return res.status(200).json({
            message: "Successfully fetch all projects",
            result
        });
    } catch (error) {
        console.log("error fetching project data:" + error);
        res.status(500).json({
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const updateProjectController = async (req: Request, res: Response) => {
    try {
        const workspaceId = Number(req.workspace?.workspaceId);
        const userId = Number(req.user?.userId);
        if (!Number.isInteger(workspaceId) || workspaceId <= 0 || !Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Workspace ID is required"
            });
        }
        const result = updateValidSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            })
        }
        const projectId = Number(req.params.id);

        const updateProject = await updateProjectService(projectId, req.body);

        if (!updateProject) {
            return res.status(404).json({
                error: "Project not found",
            });
        }

        await createActivityService({
            action: "Project Updated",
            description: `Project ${updateProject.name} was updated`,
            userId,
            projectId,
            workspaceId
        })

        return res.status(200).json({
            message: "Project update successfully",
            data: updateProject
        })
    } catch (error) {
        console.log("Project update failed" + error);
        res.status(500).json({
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const deleteProjectController = async (req: Request, res: Response) => {
    const projectId = Number(req.params.id);
    const workspaceId = Number(req.workspace?.workspaceId);
    const userId = Number(req.user?.userId);
    if (!Number.isInteger(workspaceId) || workspaceId <= 0 || !Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
            message: "Workspace ID is required"
        });
    }

    try {
        const deleteProject = await deleteProjectService(projectId);
        if (!deleteProject) {
            return res.status(404).json({
                error: "Project not found",
            });
        }

        await createActivityService({
            action: "Project Deleted",
            description: `Project ${deleteProject.name} was deleted`,
            userId,
            projectId,
            workspaceId
        })

        return res.status(200).json({
            message: "suceesfully deleted",
            data: deleteProject
        });
    } catch (error) {
        console.log("Project update failed" + error);
        res.status(500).json({
            error: error instanceof Error ? error.message : String(error)
        })
    }
}