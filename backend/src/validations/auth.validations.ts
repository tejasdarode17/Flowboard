import z from "zod";

export const registrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(20, { message: "Name should not be more than 20 characters long" }),

  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(20, { message: "Username should not be more than 20 characters long" }),
    
  email: z.string().trim().toLowerCase().email({ message: "Invalid Email" }),
  mobile: z.string().trim().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Email or username required")
    .max(30, "Input too long"),
  password: z.string().min(6, { message: "Password is required" }),
})

export type RegisterInput = z.infer<typeof registrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
