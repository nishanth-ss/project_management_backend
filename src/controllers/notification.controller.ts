import type { Request, Response } from "express";
import { createNotification, deleteNotificationService, getNotifications, getUnreadNotificationCount, markAllNotificationAsRead, markNotificationAsRead } from "../services/notification.service.js";
import { notificationValidSchema } from "../validators/notification.validator.js";

export const createNotificationController = async (req: Request, res: Response) => {
    try {
        const workspaceId = Number(req.workspace?.workspaceId);

        if (!Number.isInteger(workspaceId) || workspaceId <= 0) {
            return res.status(400).json({
                message: "Workspace ID is required"
            });
        }

        const result = notificationValidSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.flatten().fieldErrors
            });
        }
        const notification = await createNotification(result.data, workspaceId);
        return res.status(201).json({
            message: "Notification successfully created",
            data: notification
        })

    } catch (error) {
        console.error("Failed to update membership:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export const getNotificationsController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = Number(req.user?.userId);
        const workspaceId = Number(req.workspace?.workspaceId);

        if (!userId || !workspaceId) {
            return res.status(400).json({
                message: "User ID and Workspace ID are required"
            });
        }

        const notifications = await getNotifications(
            userId,
            workspaceId
        );

        return res.status(200).json({
            message: "Notifications fetched successfully",
            data: notifications
        });

    } catch (error) {
        console.error("Failed to update membership:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const markNotificationAsReadController = async (
    req: Request,
    res: Response
) => {
    try {
        const notificationId = Number(req.params.id);
        const userId = Number(req.user?.userId);
        const workspaceId = Number(req.workspace?.workspaceId);

        if (
            !Number.isInteger(notificationId) || notificationId <= 0 ||
            !Number.isInteger(userId) || userId <= 0 ||
            !Number.isInteger(workspaceId) || workspaceId <= 0
        ) {
            return res.status(400).json({
                message: "Invalid notification, user or workspace ID"
            });
        }

        const result = await markNotificationAsRead(
            notificationId,
            userId,
            workspaceId
        );

        if (result.count === 0) {
            return res.status(404).json({
                message: "Notification not found or already read"
            });
        }

        return res.status(200).json({
            message: "Notification marked as read successfully"
        });

    } catch (error) {
        console.error("Failed to update membership:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const getUnreadNotificationCountController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = Number(req.user?.userId);
        const workspaceId = Number(req.workspace?.workspaceId);

        if (
            !Number.isInteger(userId) || userId <= 0 ||
            !Number.isInteger(workspaceId) || workspaceId <= 0
        ) {
            return res.status(400).json({
                message: "Invalid user or workspace ID"
            });
        }

        const count = await getUnreadNotificationCount(
            userId,
            workspaceId
        );

        return res.status(200).json({
            message: "Unread notification count fetched successfully",
            data: {
                unreadCount: count
            }
        });

    } catch (error) {
        console.error("Failed to update membership:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const markAllNotificationAsReadController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = Number(req.user?.userId);
        const workspaceId = Number(req.workspace?.workspaceId);


        if (
            !Number.isInteger(userId) || userId <= 0 ||
            !Number.isInteger(workspaceId) || workspaceId <= 0
        ) {
            return res.status(400).json({
                message: "Invalid  user or workspace ID"
            });
        }

        const result = await markAllNotificationAsRead(
            userId,
            workspaceId
        );

        if (result.count === 0) {
            return res.status(404).json({
                message: "Notification not found or already read"
            });
        }

        return res.status(200).json({
            message: "Notification marked as read successfully",
            updateCount: result.count
        });

    } catch (error) {
        console.error("Failed to update membership:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const deleteNotificationController = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.user?.userId);
        const workspaceId = Number(req.workspace?.workspaceId);
        const notificationId = Number(req.params?.id);

        if (
            !Number.isInteger(userId) || userId <= 0 ||
            !Number.isInteger(workspaceId) || workspaceId <= 0 ||
            !Number.isInteger(notificationId) || notificationId <= 0
        ) {
            return res.status(400).json({
                message: "Invalid  user or workspace ID"
            });
        }

        const deleteNotification = await deleteNotificationService(userId,workspaceId,notificationId);
        return res.status(200).json({
            message: "Notification successfully deleted",
            data: deleteNotification
        })

    } catch (error) {
        console.error("Failed to update membership:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
}