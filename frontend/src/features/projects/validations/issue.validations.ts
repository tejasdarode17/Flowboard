import z from "zod";

export const createIssueSchema = z.object({
    title: z.string().trim().min(3, "Title is too short").max(30, "Title is to long"),
    description: z.string().max(100, "Description too long").optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    priority: z.enum(["Low", "Medium", "High"]),
    assignedTo: z.string()
});

export const updateissueSchema = createIssueSchema.partial();

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateissueSchema>;