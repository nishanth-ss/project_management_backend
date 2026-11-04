import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
            };

            workspace?: {
                workspaceId: number;
                role: "ADMIN" | "MANAGER" | "EMPLOYEE";
            };
        }
    }
}

export const authenticationToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access token is required"
            })
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Invalid Authourization Token"
            })
        }
        const JWTSecret = process.env.JWT_SECRET;
        if (!JWTSecret) {
            throw new Error("JWT_SECRET is missing")
        }
        const decoded = jwt.verify(token, JWTSecret);
        if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "number"
        ) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }
        
        req.user = { userId: decoded.userId }
        return next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}