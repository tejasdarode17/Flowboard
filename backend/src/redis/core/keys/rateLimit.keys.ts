export type OtpPurpose = "register" | "change-password" | "forget-password" | "change-email";
export type UserActionPurpose = "invite" | "upload" | "github-repos";


export const rateLimitKeys = {

    global: (ip: string) => `rl:global:${ip}`,

    loginIp: (ip: string) => `rl:login-ip:${ip}`,
    googleLoginIp: (ip: string) => `rl:google-login:ip:${ip}`,
    loginIpAndIdentifier: (identifier: string, ip: string) => `rl:login-pair:${identifier.trim().toLowerCase()}:${ip}`,
    loginIdentifier: (identifier: string) => `rl:login-identifier:${identifier.trim().toLowerCase()}`,

    otpSendIp: (purpose: OtpPurpose, ip: string) => `rl:otp-send-ip:${purpose}:${ip}`,
    otpSendEmail: (purpose: OtpPurpose, email: string) => `rl:otp-send-email:${purpose}:${email.trim().toLowerCase()}`,
    otpSendUser: (purpose: OtpPurpose, userId: string) => `rl:otp-send-user:${purpose}:${userId}`,

    otpVerifyIp: (purpose: OtpPurpose, ip: string) => `rl:otp-verify-ip:${purpose}:${ip}`,
    otpVerifyEmail: (purpose: OtpPurpose, email: string) => `rl:otp-verify-email:${purpose}:${email.trim().toLowerCase()}`,
    otpVerifyUser: (purpose: OtpPurpose, userId: string) => `rl:otp-verify-user:${purpose}:${userId}`,

    resetPasswordIp: (ip: string) => `rl:reset-password:ip:${ip}`,
    resetPasswordEmail: (email: string) => `rl:reset-password:email:${email}`,


    userAction: (purpose: UserActionPurpose, userId: string) => `rl:user-action:${purpose}:${userId}`,
};