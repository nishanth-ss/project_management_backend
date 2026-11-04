import * as bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import type { AddMemberInput } from "../validators/member.validator.js";

export const addWorkspaceMember = async (
    workspaceId: number,
    data: AddMemberInput
) => {
    // 1. Check whether the email already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    });

    if (existingUser) {
        // Check whether the user is already in this workspace
        const existingMembership = await prisma.membership.findUnique({
            where: {
                userId_workspaceId: {
                    userId: existingUser.id,
                    workspaceId
                }
            }
        });

        // If already a member, prevent duplicate membership
        if (existingMembership) {
            throw new Error("User is already a member of this workspace");
        }

        // User exists, but membership was removed.
        // Add the user back to this workspace.
        const membership = await prisma.membership.create({
            data: {
                userId: existingUser.id,
                workspaceId,
                role: data.role
            }
        });

        return {
            user: {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email
            },
            membership
        };
    }

    // 2. Hash the password before saving it
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Create the user and membership in one transaction
    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword
            }
        });

        const membership = await tx.membership.create({
            data: {
                userId: user.id,
                workspaceId,
                role: data.role
            }
        });

        return { user, membership };
    });

    // 4. Never return the user's password
    return {
        user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email
        },
        membership: result.membership
    };
};

export const getWorkspaceMembers = async (workspaceId: number) => {
    const members = await prisma.membership.findMany({
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
    });

    return members.map((membership) => ({
        membershipId: membership.id,
        user: membership.user,
        role: membership.role,
        joinedAt: membership.createdAt
    }));
};

export const updateWorkSpaceMemberRole = async (workspaceId: number, membershipId: number, role: "MANAGER" | "EMPLOYEE") => {
    const membership = await prisma.membership.findFirst({
        where: {
            id: membershipId, workspaceId
        },
    });

    if (!membership) {
        throw new Error("Member not found in this workspace");
    }

    const updatedMembership = await prisma.membership.update({
        where: {
            id: membershipId
        },
        data: {
            role
        },
        select: {
            id: true,
            userId: true,
            workspaceId: true,
            role: true,
            createdAt: true,
             user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    })
    return updatedMembership;
}

export const removeWorkspaceMember = async (workspaceId: number, membershipId: number, currentUserId: number) => {
    const membership = await prisma.membership.findFirst({
        where: {
            id: membershipId,
            workspaceId
        },
        select: {
            id: true,
            userId: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    if (!membership) {
        throw new Error("Member not found in this workspace");
    }

    if (membership.userId === currentUserId) {
        throw new Error("You cannot remove your own membership");
    }

    await prisma.membership.delete({
        where: {
            id: membershipId
        },
    });

    return {
        membershipId: membership.id,
        removedMember: membership.user,
        message: "Member removed successfully"
    };
}