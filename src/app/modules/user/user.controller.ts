import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import UserService from './user.service';

const GetMyProfile = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await UserService.GetMyProfile(user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User profile fetched successfully',
    data: result,
  });
});

const UserController = { GetMyProfile };

export default UserController;
