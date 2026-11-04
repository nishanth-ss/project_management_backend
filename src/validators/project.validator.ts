import z from "zod";

export const projectValidSchema = z.object({
    name: z.string().trim().min(1,"Name is required"),
    description: z.string().optional(),
    status: z.enum(["PLANNING","COMPLETED","ACTIVE","ON_HOLD"]).optional(),
});

export const updateValidSchema = z.object({
    name: z.string().trim().optional(),
    description: z.string().optional(),
    status: z.enum(["PLANNING","COMPLETED","ACTIVE","ON_HOLD"]).optional(),
});

export type ProjectValidSchemaInput = z.infer<typeof projectValidSchema>
export type UpdateValidSchemaInput = z.infer<typeof updateValidSchema>