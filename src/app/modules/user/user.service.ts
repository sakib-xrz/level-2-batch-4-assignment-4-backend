import { JwtPayload } from 'jsonwebtoken';
import { User } from './user.model';

const GetMyProfile = async (user: JwtPayload) => {
  const result = await User.findOne({
    email: user.email,
    is_blocked: false,
  });

  if (!result) {
    throw new Error('User not found');
  }

  return result;
};

const UserService = { GetMyProfile };

export default UserService;
