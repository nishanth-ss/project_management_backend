import z from "zod";

export const notificationValidSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    message: z.string().trim().min(1, "Message is required"),
    type: z.string().trim().min(1, "Type is required"),
    isRead: z.boolean().default(false),
    userId: z.number().int().positive("Invalid user ID")
});

export type NotificationValidSchemaInput = z.infer<typeof notificationValidSchema>