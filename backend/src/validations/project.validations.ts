import { z } from "zod";


export const projectSchema = z.object({
    name: z.string().trim().min(3, "Name is too short").max(30, "Name is to long"),
    description: z.string().max(100, "Description too long").optional(),
    emoji: z.string().optional(),
    emojiId: z.string().optional(),
    // workspaceId: z.string()
})


export const updateProjectSchema = projectSchema.partial();


export type ProjectInput = z.infer<typeof projectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>

