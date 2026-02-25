import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: {
      accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
});

const logoutUser = catchAsync(async (req, res) => {
  const result = await AuthServices.logoutUserFromDB(req, res);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged out successfully.',
    data: result,
  });
});

const generateAndSendOTP = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthServices.generateAndSendOTPFromDB(email as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP is sent successfully.',
    data: result,
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const result = await AuthServices.verifyOTPFromDB(email, otp);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP is verified successfully.',
    data: result,
  });
});

const resetPasword = catchAsync(async (req, res) => {
  const { email, newPassword } = req.body;
  const result = await AuthServices.resetPasswordFromDB(email, newPassword);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is reset successfully.',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  refreshToken,
  generateAndSendOTP,
  verifyOTP,
  resetPasword,
  logoutUser,
};
