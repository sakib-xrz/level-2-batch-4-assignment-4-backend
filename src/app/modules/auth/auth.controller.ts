import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AuthService from './auth.services';
import config from '../../config';

const Login = catchAsync(async (req, res) => {
  const result = await AuthService.Login(req.body);

  const { accessToken, refreshToken } = result;

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true,
    sameSite: true,
    secure: config.node_env === 'production',
  };

  res.cookie('REFRESH_TOKEN', refreshToken, cookieOptions);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Login successful',
    data: {
      token: accessToken,
    },
  });
});

const Register = catchAsync(async (req, res) => {
  const result = await AuthService.Register(req.body);

  const { accessToken, refreshToken } = result;

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true,
    sameSite: true,
    secure: config.node_env === 'production',
  };

  res.cookie('REFRESH_TOKEN', refreshToken, cookieOptions);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User registered successfully',
    data: {
      token: accessToken,
    },
  });
});

const Logout = catchAsync(async (_req, res) => {
  res.clearCookie('REFRESH_TOKEN');

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Logout successful',
  });
});

const AuthController = { Login, Register, Logout };

export default AuthController;
