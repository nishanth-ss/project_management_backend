import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import type { LoginInput } from "../validators/auth.validator.js";


export const loginUser = async (data: LoginInput) => {
    const user = await prisma.user.findUnique({
        where: { email: data.email }
    });
    if (!user) {
        throw new Error("Invalid email or password")
    }

    const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password")
    }

    const jwtSecret = process.env.JWT_SECRET;
    if(!jwtSecret){
        throw new Error("JWT_SECRET is missing in the .env file")
    }

    const token = jwt.sign(
        {userId: user.id},
        jwtSecret,
        {expiresIn: '1d'}
    )

    return {
        user : {
            id: user.id,
            email: user.email,
            name: user.name
        }, token
    }
}