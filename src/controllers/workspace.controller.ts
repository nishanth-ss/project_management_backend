import type { Request, Response } from "express";
import { createWorkspace, deleteWorkspace, getAllWorkspace, updateWorkspace } from "../services/workspace.service.js";
import { createWorkSpaceSchema } from "../validators/workspace.validator.js";
import { any, success } from "zod";


export const createWorkspaceController = async (req: Request, res: Response) => {
    const result = createWorkSpaceSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: "validation error",
            details: result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }))
        })
    }
    try {
        const user = await createWorkspace(req.body);
        if (!user) {
            return res.status(409).json({
                error: "Name already exists"
            })
        }
        return res.status(201).json({
            message: "Workspace Successfully created",
            user
        })
    } catch (error) {
        console.log("create workspace error", error)
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const getAllWorkspaceController = async (req: Request, res: Response) => {
    try {
        const allWorkspace = await getAllWorkspace();
        return res.status(200).json({ message: "Successfull fetch all workspace", workspace: allWorkspace });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const updateWorkspaceController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            errors: { id: ["Invalid user ID"] },
        })
    }
    const result = createWorkSpaceSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: "Validation failed",
            details: result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    try {
        const workspace = await updateWorkspace(id, req.body);
        if (!workspace) {
            return res.status(404).json({
                error: "Workspace is not found"
            })
        }
        return res.status(200).json({ message: "workspace successfully updated", data: workspace })
    } catch (error) {
        console.error("Failed to update workspace:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export const deleteWorkspaceController = async (req: Request,res: Response) =>{
    const id = Number(req.params.id);
    if(!Number.isInteger(id) && id <=0){
        return res.status(400).json({
            success: false,
            error: {id: `${id} is not valid`}
        })
    }

    try {
        const workspace = await deleteWorkspace(id);
        res.status(200).json({succes: true, message: "Successfull deleted",workspace});
    } catch (error) {
         console.error("Failed to delete workspace:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
}