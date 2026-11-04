import { prisma } from "../lib/prisma.js"
import type { CreateTaskValidInput, UpdateTaskValidInput } from "../validators/task.validator.js"


export const createTaskService = async (input: CreateTaskValidInput, projectId: number, workspaceId: number) => {
    const project = await prisma.project.findFirst({
        where: { id: projectId, workspaceId }
    });

    if (!project) {
        throw new Error("Project not found in this workspace")
    }

    if (input.assignedTo !== undefined) {
        const membership = await prisma.membership.findUnique({
            where: {
                userId_workspaceId: {
                    userId: input.assignedTo,
                    workspaceId
                }
            }
        });
        if (!membership) {
            throw new Error("Assigned user is not a member of this workspace");
        }
    }

    const result = await prisma.task.create({
        data: {
            title: input.title,
            ...(input.description !== undefined && { description: input.description }),
            ...(input.priority !== undefined && { priority: input.priority }),
            ...(input.status !== undefined && { status: input.status }),
            ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
            ...(input.assignedTo !== undefined && {
                assignee: {
                    connect: {
                        id: input.assignedTo
                    }
                }
            }),
            project: {
                connect: {
                    id: projectId
                }
            }
        }
    });
    return result
}

export const getAllTaskService = async (workspaceId: number) => {
    return prisma.task.findMany({
        where: {
            project: { workspaceId }
        },
        include: {
            project: {
                select: {
                    id: true,
                    name: true
                }
            },
            assignee: {
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

interface ITaskUpdateData {
    title?: string;
    description?: string;
    status?: "TODO" | "IN_PROGRESS" | "DONE";
    priority?: "LOW" | "MEDIUM" | "HIGH";
    assignedTo?: number | null;
    dueDate?: Date | null;
}
export const updateTaskService = async (id: number, input: UpdateTaskValidInput) => {
    const existingID = await prisma.task.findUnique({
        where: { id }
    });
    if (!existingID) {
        return null;
    }

    const data: ITaskUpdateData = {};
    if (input.title !== undefined) {
        data.title = input.title;
    }

    if (input.description !== undefined) {
        data.description = input.description;
    }

    if (input.status !== undefined) {
        data.status = input.status;
    }

    if (input.priority !== undefined) {
        data.priority = input.priority;
    }

    if (input.assignedTo !== undefined) {
        data.assignedTo = input.assignedTo;
    }

    if (input.dueDate !== undefined) {
        data.dueDate = input.dueDate;
    }

    return await prisma.task.update({
        where: { id },
        data
    });
}

export const deleteTaskService = async (id: number) => {
    const validID = await prisma.task.findUnique({
        where: { id }
    });
    if (!validID) throw new Error("Invalid ID");
    return prisma.task.delete({
        where: { id }
    })
}