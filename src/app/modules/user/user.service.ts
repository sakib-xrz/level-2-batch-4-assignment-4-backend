import { JwtPayload } from 'jsonwebtoken';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const GetMyProfile = async (user: JwtPayload) => {
  const result = await User.findOne({
    email: user.email,
    is_blocked: false,
  }).select('-is_blocked -createdAt -updatedAt');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return result;
};

const BlockUser = async (targatedUserId: string, user: JwtPayload) => {
  const targatedUser = await User.findById(targatedUserId);

  if (!targatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (targatedUser._id.toString() === user._id.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, 'You can not block yourself');
  }

  await User.findByIdAndUpdate(targatedUserId, { is_blocked: true });
};

const UserService = { GetMyProfile, BlockUser };

export default UserService;
