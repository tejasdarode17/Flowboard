import { z } from "zod";


export const issueSchema = z.object({
    title: z.string().trim().min(3, "Title is too short").max(30, "Title is to long"),
    description: z.string().max(100, "Description too long").optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    priority: z.enum(["Low", "Medium", "High"]),
    assignedTo: z.string().min(1, "Assignee is required")
})

export const updateissueSchema = issueSchema.partial();

export type issueInput = z.infer<typeof issueSchema>
export type UpdateissueInput = z.infer<typeof updateissueSchema>

