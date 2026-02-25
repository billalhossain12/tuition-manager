/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import { User } from '../user/user.model';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { OTP } from '../otp/otp.model';
import { TOTP } from '../otp/otp.interface';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload.email }).select('+password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');

  //create token and sent to the  client
  const jwtPayload = {
    userId: user._id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const logoutUserFromDB = async (req: Request, res: Response) => {
  // 2️⃣ Remove the refresh token cookie from browser
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(0),
  });
  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userId } = decoded;

  // checking if the user is exist
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const jwtPayload = {
    userId: user._id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const generateAndSendOTPFromDB = async (email: string) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Check cooldown period
  const recentOTP = (await OTP.findOne({
    email,
    purpose: 'password-reset',
    createdAt: {
      $gte: new Date(Date.now() - 60 * 1000),
    },
  }).sort({ createdAt: -1 })) as TOTP;

  if (recentOTP) {
    const secondsLeft = Math.ceil(
      (60 * 1000 - (Date.now() - new Date(recentOTP.createdAt).getTime())) /
        1000,
    );
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Please wait ${secondsLeft} seconds before requesting a new OTP`,
    );
  }

  // Generate OTP
  const otp = OTP.generateOTP();
  const otpHashed = await OTP.createHashedOTP(email, otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); //OTP will expire after 5 minutes

  const { purpose } = (await OTP.findOneAndUpdate(
    { email },
    { email, otpHashed, expiresAt, purpose: 'password-reset' },
    { upsert: true, new: true },
  )) as TOTP;

  // Send OTP Mail
  sendEmail(email, otp);

  return {
    email,
    expiresAt,
    purpose,
    otpHashed, // Only for development/testing
  };
};

const verifyOTPFromDB = async (email: string, inputOTP: string) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  //Check if OTP is already verified
  const isAlreadyVerified = await OTP.findOne({
    email,
    purpose: 'password-reset',
    expiresAt: { $gt: new Date() },
    verifiedAt: { $exists: true },
  }).sort({ createdAt: -1 });

  if (isAlreadyVerified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This OTP is already verfied. Please generate new one & try again.',
    );
  }

  // Find the most recent valid OTP
  const otpRecord = await OTP.findOne({
    email,
    purpose: 'password-reset',
    expiresAt: { $gt: new Date() },
    verifiedAt: { $exists: false },
  }).sort({ createdAt: -1 });

  if (!otpRecord) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP or OTP Expired');
  }

  // Check max attempts
  if (otpRecord.hasExceededAttempts()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Too many attempts. Please request a new OTP',
    );
  }

  // Check expiry
  if (otpRecord.isExpired()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP has expired');
  }

  // Verify OTP using bcrypt
  const isValid = await otpRecord.verifyOTP(inputOTP);

  if (!isValid) {
    await otpRecord.incrementAttempts();
    const attemptsLeft = otpRecord.maxAttempts - otpRecord.attempts;
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid OTP. ${attemptsLeft} attempt(s) left`,
    );
  }

  // Mark as verified
  const res = (await OTP.findOneAndUpdate(
    { email, verifiedAt: { $exists: false }, purpose: 'password-reset' },
    { verifiedAt: new Date() },
    { new: true },
  )) as TOTP;

  return res;
};

const resetPasswordFromDB = async (email: string, newPassword: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // checking if the user is exist
    const user = await User.findOne({ email })
      .select('+password')
      .session(session);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    // checking if the user is already deleted
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }

    // checking if the user is blocked
    const userStatus = user?.status;
    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }

    //hash the new password
    const newHashedPassword = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_rounds),
    );

    //Check if OTP is verified
    const isAlreadyVerified = await OTP.findOne({
      email,
      purpose: 'password-reset',
      expiresAt: { $gt: new Date() },
      maxAttempts: { $lte: 3 },
      verifiedAt: { $exists: true },
    }).sort({ createdAt: -1 });

    if (!isAlreadyVerified) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid OTP. Verify OTP first & try again.',
      );
    }

    // Prevent using the same old password
    if (await User.isPasswordMatched(newPassword, user.password)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'New password must differ from the old one!',
      );
    }

    // Update password (transaction-1)
    const updateFields = {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    };
    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      updateFields,
      { session, new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update password !',
      );
    }

    // Delete OTP Manually (transaction-2)
    const deletedOtp = await OTP.deleteMany({
      email,
    }).session(session); // Delete OTP after successful verification

    if (deletedOtp.deletedCount === 0) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to delete OTP !',
      );
    }

    await session.commitTransaction();
    return null;
  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err);
  } finally {
    session.endSession();
  }
};

export const AuthServices = {
  loginUser,
  refreshToken,
  generateAndSendOTPFromDB,
  verifyOTPFromDB,
  resetPasswordFromDB,
  logoutUserFromDB,
};
