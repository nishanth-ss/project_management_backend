import type { Request, Response } from "express";
import { createUserSchema, updateUserSchema } from "../validators/user.validator.js";
import { createUser, deleteUser, getAllUsers, updateUser } from "../services/user.service.js";

export const getUsersController = async (_req: Request, res: Response) => {
    try {
        const allUsers = await getAllUsers();
        return res.status(200).json({ message: "Successfull fetch all users", users: allUsers })
    } catch (error) {
        console.log("failed to fetch all users");
        return res.status(500).json({ error: error instanceof Error ? error.message : String(error), })
    }
}

export const createUserController = async (req: Request, res: Response) => {
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: "Validation failed",
            details: result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }
    try {
        const user = await createUser(result.data);

        if (!user) {
            return res.status(409).json({
                error: "Email is already registered",
            });
        }

        return res.status(201).json({
            message: "User created successfully",
            user,
        });
    } catch (error) {
        console.error("Failed to create user:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export const updateUserController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            errors: { id: ["Invalid user ID"] },
        })
    }
    const result = updateUserSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: "Validation failed",
            details: result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }
    
    try {
        const user = await updateUser(id, result.data);
        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }
        return res.status(200).json({
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        console.error("Failed to update user:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export const deleteUserController = async (req: Request,res: Response)=>{
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            errors: { id: ["Invalid user ID"] },
        })
    }
    try {
        const user = await deleteUser(id);
        return res.status(200).json({ message: "Successfull deleted the user", user })
    } catch (error) {
        console.log("failed to delete all users");
        return res.status(500).json({ error: error instanceof Error ? error.message : String(error), })
    }
}