import type { Request, Response } from "express";
import { commentValidatorSchema } from "../validators/comment.validator.js";
import { createComment, deleteCommentService, getAllCommentService, updateCommentsService } from "../services/comment.service.js";

export const createCommentController = async (req: Request, res: Response) => {
    const taskId = Number(req.params.taskId);
    const userId = Number(req.user?.userId);
    const workspaceId = Number(req.params.workspaceId);
    if (!userId || !taskId || !workspaceId) {
        throw new Error("taskId, userId and workspaceId is required")
    }
    const result = commentValidatorSchema.safeParse(req.body);
    if (!result.success) {
        if (!result.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            })
        }
    }
    try {
        const comment = await createComment(result.data, taskId, userId, workspaceId);
        return res.status(201).json({
            message: "Comment added successfully",
            data: comment
        })
    } catch (error) {
        console.error("Failed to create comment:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export const getAllCommentsController = async (req: Request, res: Response) => {
    const taskId = Number(req.params.taskId);
    const workspaceId = Number(req.params.workspaceId);
    try {
        const comments = await getAllCommentService(taskId, workspaceId);
        return res.status(200).json({
            message: "Successfully fetch all comments",
            data: comments
        })
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export const updateCommentController = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const workspaceId = Number(req.params.workspaceId);
    const commentId = Number(req.params.commentId);
    const taskId = Number(req.params.taskId);
    if (
        !userId ||
        !workspaceId ||
        !Number.isSafeInteger(commentId) ||
        commentId <= 0 ||
        !Number.isSafeInteger(taskId) ||
        taskId <= 0
    ) {
        return res.status(400).json({
            message: "Invalid ID provided"
        });
    }
    try {
        const result = commentValidatorSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            })
        }
        const updateComment = await updateCommentsService(taskId, workspaceId, commentId, result.data, userId);
        return res.status(200).json({
            message: "Comment successfully updated",
            data: updateComment
        });
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export const deleteCommentController = async (
    req: Request,
    res: Response
) => {
    try {
        const taskId = Number(req.params.taskId);
        const commentId = Number(req.params.commentId);

        const userId = req.user?.userId;
        const workspaceId = req.workspace?.workspaceId;
        const userRole = req.workspace?.role;

        if (
            !Number.isSafeInteger(taskId) ||
            taskId <= 0 ||
            !Number.isSafeInteger(commentId) ||
            commentId <= 0
        ) {
            return res.status(400).json({
                message: "Invalid task ID or comment ID"
            });
        }

        if (!userId || !workspaceId || !userRole) {
            return res.status(403).json({
                message: "Workspace access required"
            });
        }

        const result = await deleteCommentService(
            taskId,
            workspaceId,
            commentId,
            userId,
            userRole
        );

        return res.status(200).json({
            message: "Comment deleted successfully",
            data: result
        });

    } catch (error) {
        console.error("Failed to delete comment:", error);

        return res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "Internal server error"
        });
    }
};