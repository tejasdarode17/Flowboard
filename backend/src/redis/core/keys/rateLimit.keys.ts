export const rateLimitKeys = {
    signupOtp: (email: string) =>
        `rl:signup-otp:${email.toLowerCase()}`,

    forgotPasswordOtp: (email: string) =>
        `rl:forgot-password:${email.toLowerCase()}`,

    login: (email: string) =>
        `rl:login:${email.toLowerCase()}`,
};