export type BaseOtpPayload = {
    otpHash: string;
    attempts: number;
};


export type SignUpOtpPayload = BaseOtpPayload & {
    name: string;
    email: string;
    username: string;
    mobile?: string;
    passwordHash: string;
};

export type PasswordResetOtpPayload = BaseOtpPayload & {
    email: string;
};

export type ChangeEmailOtpPayload = BaseOtpPayload & {
    userId: string;
    email: string
    newEmail: string;
};