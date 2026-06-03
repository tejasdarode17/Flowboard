import z from "zod";

export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(3, "Name should be atleat more than three charcters").max(30, "Name is too long"),
    description: z.string().max(100, "Description too long").optional(),
    logo: z.instanceof(File).optional(),
});


export const inviteMemberSchema = z.object({
    email: z.string().email("Invalid email address"),
    role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

export type InviteWorksapceInput = z.infer<typeof inviteMemberSchema>
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;