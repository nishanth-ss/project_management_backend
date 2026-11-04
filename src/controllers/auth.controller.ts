import type { Request, Response } from "express";
import { loginSchema } from "../validators/auth.validator.js";
import { loginUser } from "../services/auth.service.js";


export const loginUserController = async (req: Request, res: Response) => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: "validation error",
                details: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }))
            })
        }

        const data = await loginUser(result.data);
        return res.status(200).json({
            message: "Login successful",
            data
        });
    } catch (error) {
        console.error("Failed to delete workspace:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
}