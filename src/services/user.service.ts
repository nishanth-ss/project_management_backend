import bcrypt from "bcryptjs"
import { prisma } from "../lib/prisma.js"
import type { CreateUserInput, updateUserInput } from "../validators/user.validator.js"


export const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }
    })
}

export const createUser = async (input: CreateUserInput) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: input.email,
        },
    });

    if (existingUser) {
        return null;
    }
    const hashedPassword = await bcrypt.hash(input.password, 10);
    return prisma.user.create({
        data: {
            name: input.name,
            password: hashedPassword,
            email: input.email
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        }
    })
}

export const updateUser = async (id: number, input: updateUserInput) => {
    const existingUser = await prisma.user.findUnique({
        where: { id },
    });

    if (!existingUser) {
        return null;
    }

    if (input.email) {
        const emailOwner = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if (emailOwner && emailOwner.id !== id) {
            throw new Error("Email is already registered");
        }
    }

    const data: {
        name?: string;
        email?: string;
        password?: string;
    } = {};

    if (input.name !== undefined) {
        data.name = input.name;
    }

    if (input.email !== undefined) {
        data.email = input.email;
    }

    if (input.password !== undefined) {
        data.password = await bcrypt.hash(input.password, 10);
    }

    return prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });
}

export const deleteUser = async (id: number)=>{
    const user = await prisma.user.findUnique({
        where: {id}
    });
    if(!user) throw new Error("Invalid ID")
    return prisma.user.delete({
        where: {id},
        select:{
            name: true,
            email: true,
            id: true
        }
    })
}