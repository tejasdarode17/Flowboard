import crypto from "crypto"
import bcrypt from "bcryptjs";
import { RegisterInput } from "../../validations/auth.validations";
import { deleteCache, getCache, setCache, updateCache } from "../core/cache";
import AppError from "../../utils/AppError";
import { BaseOtpPayload, ChangeEmailOtpPayload, PasswordResetOtpPayload, } from "../../types/otp.types";
import { sendOTPEmail } from "../../utils/mailer";
import { otpKeys } from "../core/keys/otp.keys";
import redis from "../core/client";
import { incrementRateLimit } from "../rate_limit/rateLimit.config";

export function generateOtp() {
    const otp = crypto.randomInt(100000, 1000000);
    return otp.toString();
}

export async function sendSignUpOTP(payload: RegisterInput) {
    const { name, email, username, mobile, password } = payload;

    const key = otpKeys.signup(email);

    const otp = generateOtp();

    const [passwordHash, otpHash] = await Promise.all([
        bcrypt.hash(password, 10),
        bcrypt.hash(otp, 10),
    ]);

    await setCache(
        key,
        {
            name,
            email,
            username,
            mobile,
            passwordHash,
            otpHash,
        },
        300
    );


    await sendOTPEmail(email, otp);
}


export async function sendForgetPasswordOTP(email: string) {

    const key = otpKeys.resetPassword(email);

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    const payload: PasswordResetOtpPayload = {
        email,
        otpHash,
    };

    await setCache(key, payload, 300);
    await sendOTPEmail(email, otp);
}


export async function sendChangeEmailOtp(data: ChangeEmailOtpPayload) {

    const key = otpKeys.changeEmail(data.newEmail)

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    const payload: ChangeEmailOtpPayload = {
        email: data.email,
        userId: data.userId,
        newEmail: data.newEmail,
        otpHash: otpHash,
    }

    await setCache(key, payload, 300);
    await sendOTPEmail(data.newEmail, otp);
}


export async function verifyOTP<T extends BaseOtpPayload>(key: string, otp: string) {

    const record = await getCache<T>(key);
    if (!record) throw new AppError("OTP expired", 400);

    const attemptsKey = `${key}:attempts`;
    const attempts = await incrementRateLimit(attemptsKey, 300)

    if (attempts > 5) {
        await deleteCache(key);
        await deleteCache(attemptsKey);
        throw new AppError("Too many attempts", 429);
    }

    const isValid = await bcrypt.compare(otp, record.otpHash);
    if (!isValid) throw new AppError("Invalid OTP", 400);

    await deleteCache(key);
    await deleteCache(attemptsKey);
    return record;

} 