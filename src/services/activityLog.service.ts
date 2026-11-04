import { prisma } from "../lib/prisma.js";

type CreateActivityInput = {
    action: string;
    description?: string;
    userId: number;
    workspaceId: number;
    projectId?: number;
    taskId?: number;
}

export const createActivityService = (input: CreateActivityInput) => {
    return prisma.activityLog.create({
        data: {
            action: input.action,
            ...(input.description !== undefined && { description: input.description }),
            userId: input.userId,
            workspaceId: input.workspaceId,
            ...(input.projectId !== undefined && { projectId: input.projectId }),
            ...(input.taskId !== undefined && { taskId: input.taskId }),
        },
    })
}

export const getActivityLogsService = async (workspaceId: number)=>{
    return prisma.activityLog.findMany({
        where: {
            workspaceId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}