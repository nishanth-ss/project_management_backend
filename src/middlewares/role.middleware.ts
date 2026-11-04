import type { NextFunction, Request, Response } from "express";

type WorkSpaceRole = "ADMIN" | "MANAGER" | "EMPLOYEE"

export const authorizeRole = (...allowedRoles: WorkSpaceRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.workspace?.role;
        if (!userRole) {
            return res.status(403).json({
                message: "Workspace membership is required"
            });
        }
console.log(req.workspace);

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: "You do not have permission to perform this action"
            });
        }

        return next();
    }
}