import z from "zod";

export const createProjectSchema = z.object({
    name: z.string().trim().min(3, "Name should be atleat more than three charcters").max(30, "Name is too long"),
    description: z.string().max(100, "Description too long").optional(),
    emoji: z.string().optional(),
    emojiId: z.string().optional(),
});


export const updateProjectSchema = createProjectSchema.partial()

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;