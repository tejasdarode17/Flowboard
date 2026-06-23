
export const otpKeys = {
    signup: (email: string) => `otp:signup:${email.toLowerCase()}`,
    resetPassword: (email: string) => `otp:reset-password:${email.toLowerCase()}`,
    changeEmail: (email: string) => `otp:change-email:${email.toLowerCase()}`,
};
