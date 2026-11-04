import {z} from "zod";

export const createWorkSpaceSchema = z.object({
    name: z.string().trim().min(1,"Name field is required")
});

export type CreateWorkspaceInput = z.infer<typeof createWorkSpaceSchema>;