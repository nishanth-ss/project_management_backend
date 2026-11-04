import { prisma } from "../lib/prisma.js";
import type { CommentValidatorInput } from "../validators/comment.validator.js";

export const createComment = async (
    input: CommentValidatorInput,
    taskId: number,
    userId: number,
    workspaceId: number
) => {
    const task = await prisma.task.findUnique({
        where: {
            id: taskId,
            project: {
                workspaceId
            }
        }
    })

    if (!task) {
        throw new Error("Task not found in this workspace");
    }

    const comment = await prisma.comment.create({
        data: {
            content: input.content,
            task: {
                connect: {
                    id: taskId
                }
            },
            user: {
                connect: {
                    id: userId
                }
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    return comment;
}

export const getAllCommentService = async (taskId: number, workspaceId: number) => {

    const task = await prisma.task.findUnique({
        where: {
            id: taskId,
            project: {
                workspaceId
            }
        }
    });

    if (!task) {
        throw new Error("Task not found in this workspace");
    }

    const comments = await prisma.comment.findMany({
        where: {
            taskId
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
    });

    return comments;
}

export const updateCommentsService = async (taskId: number, workspaceId: number, commentId: number, input: CommentValidatorInput, userId: number) => {
    const task = await prisma.task.findUnique({
        where: {
            id: taskId,
            project: {
                workspaceId
            }
        }
    });
    if (!task) throw new Error("Id is not valid");

    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId,
            taskId,
            userId
        }
    });

    if (!comment) {
        throw new Error("Comment not found or you are not authorized to edit it");
    }

    const updateComment = await prisma.comment.update({
        where: {
            id: commentId
        },
        data: {
            content: input.content
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    return updateComment;
}

export const deleteCommentService = async (
    taskId: number,
    workspaceId: number,
    commentId: number,
    userId: number,
    userRole: "ADMIN" | "MANAGER" | "EMPLOYEE"
) => {
    const task = await prisma.task.findUnique({
        where: {
            id: taskId,
            project: {
                workspaceId
            }
        }
    });
    if(!task){
        throw new Error("Task not found")
    }

    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId,
            taskId
        }
    })
    if(!comment){
        throw new Error("Comment not found")
    }

    if(userRole !== "ADMIN" || userId !== comment.userId){
        throw new Error("You are not authorized to delete this comment")
    }

    await prisma.comment.delete({
        where: {
            id: commentId
        }
    });

    return {
        message: "comment successfully delete",
        commentId
    }
}