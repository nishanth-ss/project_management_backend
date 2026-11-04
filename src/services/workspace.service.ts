import { prisma } from "../lib/prisma.js"
import type { CreateWorkspaceInput } from "../validators/workspace.validator.js"

export const createWorkspace = async (input: CreateWorkspaceInput) => {
    const existingName = await prisma.workspace.findUnique({
        where: {
            name: input.name,
        },
    });
    if (existingName) throw new Error("Workspace name is already existing.");

    return prisma.workspace.create({
        data: { name: input.name }
    })
}

export const getAllWorkspace = async () => {
    return prisma.workspace.findMany({})
}

export const updateWorkspace = async (id: number, input: CreateWorkspaceInput) => {
    const existingWorkspace = await prisma.workspace.findUnique({
        where: { id },
    });
    if (!existingWorkspace) return null;
    return prisma.workspace.update({
        where: {id},
        data: {name: input.name}
    })
}

export const deleteWorkspace = async (id: number)=>{
    const workspace = await prisma.workspace.findUnique({
        where: {id}
    });
    if(!workspace) throw new Error("Invalid ID")
    return prisma.workspace.delete({
        where: {id}
    })
}