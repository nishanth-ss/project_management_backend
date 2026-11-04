import z from "zod";


export const taskValidSchema = z.object({
    title: z.string().trim().min(1,"Title is required"),
    description: z.string().trim().optional(),
    status: z.enum(["TODO","IN_PROGRESS","DONE"]).optional(),
    priority: z.enum(["LOW","MEDIUM","HIGH"]).optional(),
    dueDate: z.coerce.date().optional(),
    assignedTo: z.number().positive().optional()
});

export const updateTaskValidSchema = z.object({
    title: z.string().trim().min(1,"Title is required").optional(),
    description: z.string().trim().optional(),
    status: z.enum(["TODO","IN_PROGRESS","DONE"]).optional(),
    priority: z.enum(["LOW","MEDIUM","HIGH"]).optional(),
    dueDate: z.coerce.date().optional(),
    assignedTo: z.number().positive().optional()
});

export type CreateTaskValidInput = z.infer<typeof taskValidSchema>;
export type UpdateTaskValidInput = z.infer<typeof updateTaskValidSchema>;