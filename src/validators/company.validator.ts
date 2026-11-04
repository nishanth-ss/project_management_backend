import { z } from "zod";

export const companyRegistrationSchema = z.object({
    companyName: z.string().trim().min(1, "Company name is required"),
    name: z.string().trim().min(1, "Admin name is required"),
    email: z.string().trim().email("Invalid email address")
        .transform((email) => email.toLowerCase()),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type CompanyRegistrationInput =
    z.infer<typeof companyRegistrationSchema>;