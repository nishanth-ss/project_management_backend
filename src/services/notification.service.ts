import { prisma } from "../lib/prisma.js"
import type { NotificationValidSchemaInput } from "../validators/notification.validator.js"


export const createNotification = async (input: NotificationValidSchemaInput, workspaceId: number)=>{
     const membership = await prisma.membership.findUnique({
        where: {
            userId_workspaceId: {
                userId: input.userId,
                workspaceId
            }
        }
    });

    if (!membership) {
        throw new Error("User does not belong to this workspace");
    }
     const result = await prisma.notification.create({
        data: {
            title: input.title,
            message: input.message,
            type: input.type,
            isRead: input.isRead,
            userId: input.userId,
            workspaceId
        }
    });

    return result;
}

export const getNotifications = async (
    userId: number,
    workspaceId: number
) => {
    return await prisma.notification.findMany({
        where: {
            userId,
            workspaceId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

export const markNotificationAsRead = async (
    notificationId: number,
    userId: number,
    workspaceId: number
) => {
    const notification = await prisma.notification.updateMany({
        where: {
            id: notificationId,
            userId,
            workspaceId,
            isRead: false
        },
        data: {
            isRead: true
        }
    });

    return notification;
};

export const getUnreadNotificationCount = async (
    userId: number,
    workspaceId: number
) => {
    return await prisma.notification.count({
        where: {
            userId,
            workspaceId,
            isRead: false
        }
    });
};

export const markAllNotificationAsRead = async (
    userId: number,
    workspaceId: number
) => {
    const notification = await prisma.notification.updateMany({
        where: {
            userId,
            workspaceId,
            isRead: false
        },
        data: {
            isRead: true
        }
    });

    return notification;
};

export const deleteNotificationService = async (
    userId: number,
    workspaceId: number,
    notificationId: number
) => {
    const notification = await prisma.notification.deleteMany({
        where: {
            userId,
            workspaceId,
            id: notificationId
        }
    });

    return notification;
};