import { z } from "zod";

export const addMemberSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  role: z.enum(["MANAGER", "EMPLOYEE"])
});

export const updateMemberRoleSchema = z.object({
    role: z.enum(["MANAGER","EMPLOYEE"])
});

export type updateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;