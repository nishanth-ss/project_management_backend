import type { ProjectStatus } from "../../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import { type ProjectValidSchemaInput, type UpdateValidSchemaInput } from "../validators/project.validator.js";


export const createProjectService = async (input: ProjectValidSchemaInput, workspaceId: number) => {
    const result = await prisma.project.create({
        data: {
            name: input.name,
            ...(input.description !== undefined && {
                description: input.description
            }),
             ...(input.status !== undefined && {
                status: input.status
            }),
            workspace:{
                connect: {
                    id: workspaceId
                }
            }
        }
    });
    return result;
}

export const getAllProjectsService = async ()=>{
    const result = await prisma.project.findMany({})
    return result
}

export const updateProjectService = async (id: number, input: UpdateValidSchemaInput) => {
    const result = await prisma.project.findUnique({
        where: {id},
    });
    if(!result){
        return null;
    }
    const data: {name?: string, description?: string, status?: ProjectStatus} = {};
    if(input.name) data.name = input.name;
    if(input.description) data.description = input.description;
    if(input.status) data.status = input.status;

    return prisma.project.update({
        where: {id},
        data
    })
}

export const deleteProjectService = async (id: number) => {
    const result = await prisma.project.findUnique({
        where: {id}
    });
    if(!result) return null;
    return prisma.project.delete({
        where: {id}
    });
}