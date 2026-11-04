import z from "zod";

export const commentValidatorSchema = z.object({
    content: z.string().trim().min(1, "Content is required"),
});

export type CommentValidatorInput = z.infer<typeof commentValidatorSchema>;