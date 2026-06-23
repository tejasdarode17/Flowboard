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


export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long")
    .optional(),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .optional(),
  mobile: z
    .string()
    .trim()
    .optional(),
  avatar: z.string().url().optional(),
});


const otpField = z.string().trim().length(6, "OTP must be 6 digits").regex(/^\d{6}$/, "OTP must contain only numbers");
const emailField = z.string().trim().toLowerCase().email("Invalid email");

export const emailSchema = z.object({
  email: emailField,
});

export const verifyOtpSchema = z.object({
  email: emailField,
  otp: otpField,
});

export const resetPasswordSchema = z.object({
  email: emailField,
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const verifyEmailSchema = z.object({
  email: emailField,
  otp: otpField,
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;


export type RegisterInput = z.infer<typeof registrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
