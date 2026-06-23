import z from "zod";

export const editProfileSchema = z.object({
    name: z.string().trim().min(3, "Name must be at least 3 characters long").optional(),
    username: z
        .string()
        .trim()
        .toLowerCase()
        .min(3, { message: "Username must be at least 3 characters long." })
        .max(20, { message: "Username should not be more than 20 characters long" })
        .optional(),
    mobile: z.string().optional(),
    avatar: z.instanceof(File).optional(),
})

export type EditProfileInputInput = z.infer<typeof editProfileSchema>;
