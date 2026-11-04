import bcrypt from "bcryptjs";
import type { CompanyRegistrationInput } from "../validators/company.validator.js";
import { prisma } from "../lib/prisma.js";


export const createCompany = async (data: CompanyRegistrationInput) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = await prisma.$transaction(async (tx)=>{
        const workspace = await tx.workspace.create({
            data: {
                name: data.companyName
            }
        });

        const user = await tx.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashedPassword
            }
        })

        const membership = await tx.membership.create({
            data: {
                userId: user.id,
                workspaceId: workspace.id,
                role: "ADMIN"
            }
        })

        return {
            user, workspace, membership
        }
    })

    return {
        workspace : result.workspace,
        user:{
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
        },
        membership: result.membership
    }
}