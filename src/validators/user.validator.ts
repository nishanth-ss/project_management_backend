import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().trim().min(1, "name is required"),
    email: z.string().trim().email("Invalid email address").transform((email) => email.toLowerCase()),
    password: z.string().min(8, "password must be atleast 8 characters")
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
    name: z.string().trim().min(1, "name is required").optional(),
    email: z.string().trim().email("Invalid email address").transform((email) => email.toLowerCase()).optional(),
    password: z.string().min(8, "password must be atleast 8 characters").optional()
}).refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field is required"
});

export type updateUserInput = z.infer<typeof updateUserSchema>;