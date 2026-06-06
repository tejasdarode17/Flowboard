import { z } from "zod";

export const linkRepositorySchema = z.object({
    projectId: z.string().uuid(),
    repoId: z.string(),
    repoFullName: z.string().min(1),
});


export type LinkRepositoryInput = z.infer<typeof linkRepositorySchema>;

