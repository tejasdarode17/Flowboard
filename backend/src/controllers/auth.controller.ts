import { NextFunction, Request, Response } from "express";
import { changeEmailOtp, changePasswordOtp, forgetPasswordOtp, getCurrentUser, getNewTokens, googleAuth, loginUser, registerUser, resetPassword, validateUserSignup, verifyEmail, verifyResetPasswordOtp, } from "../services/auth.services";
import { emailSchema, loginSchema, registrationSchema, resetPasswordSchema, verifyEmailSchema, verifyOtpSchema } from "../validations/auth.validations";
import AppError from "../utils/AppError";
import admin from "../config/firebase";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";


const isProduction = process.env.NODE_ENV === "production";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {

    const body = registrationSchema.parse(req.body);
    await registerUser(body);

    return res.status(200).json({
      success: true,
      message: "Otp Sent Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export async function validateUserController(req: Request, res: Response, next: NextFunction) {
  try {

    const body = verifyOtpSchema.parse(req.body)
    const { email, otp } = body
    const data = await validateUserSignup(email, otp)
    const { user, accessToken, refreshToken } = data

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 15,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    });


    return res.status(200).json({
      success: true,
      message: "User Registred Succesfully",
      user,
    });

  } catch (error) {
    next(error)
  }
}



export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const body = loginSchema.parse(req.body);
    const data = await loginUser(body);
    const { user, accessToken, refreshToken } = data;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 15,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "User logged in",
      user,
    });
  } catch (error) {
    next(error);
  }
};


export async function googleLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      throw new AppError("Google token is required", 400);
    }

    const decoded = await admin.auth().verifyIdToken(googleToken);
    const { email, name, picture } = decoded;

    if (!email) {
      throw new AppError("Email not found in Google token", 400);
    }

    const user = await googleAuth({ email, name, picture, });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 15,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    });

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        provider: user.provider,
      },
    });

  } catch (error) {
    next(error);
  }
};


export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req?.user?.userId
    if (!userId) return next(new AppError("Not authenticated", 401));
    const data = await getCurrentUser(userId);
    return res.status(200).json({
      success: true,
      message: "Authenticated user",
      user: data?.user,
    });
  } catch (error) {
    next(error);
  }
};




export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshTokenFromReq = req.cookies.refreshToken;

    if (!refreshTokenFromReq) {
      throw new AppError("Not authenticated", 401);
    }

    const tokens = await getNewTokens(refreshTokenFromReq);

    const { newAccessToken, newRefreshToken } = tokens;

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 15,
      path: "/",
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Authenticated user",
    });
  } catch (error) {
    next(error);
  }
};


export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};


export async function forgetPasswordOtpController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = emailSchema.parse(req.body)
    const result = await forgetPasswordOtp(email);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}

export async function changePasswordOtpController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError("Not authenticated", 401));

    const result = await changePasswordOtp(userId);

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    next(error);
  }
}

export async function verifyOtpForPasswordCntroller(req: Request, res: Response, next: NextFunction) {
  try {
    const data = verifyOtpSchema.parse(req.body)

    const result = await verifyResetPasswordOtp(data)

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error)
  }
}


export async function resetPasswordController(req: Request, res: Response, next: NextFunction) {
  try {

    const data = resetPasswordSchema.parse(req.body)
    const result = await resetPassword(data);

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    next(error);
  }
}

export const changeEmailController = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const userId = req.user?.userId;
    if (!userId) throw new AppError("Unauthorized", 401);

    const data = emailSchema.parse(req.body)

    const result = await changeEmailOtp(data.email, userId);

    res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    next(error)
  }
};


export const verifyChangeEmailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = verifyEmailSchema.parse(req.body)

    const result = await verifyEmail(data);

    res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    next(error)
  }
};

