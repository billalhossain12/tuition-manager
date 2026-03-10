import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createTutor = catchAsync(async (req, res) => {
  const { tutor: tutorData } = req.body;

  const result = await UserServices.createTutorIntoDB(req.file, tutorData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tutor is created succesfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved succesfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const {id} = req.params;

  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status is updated succesfully',
    data: result,
  });
});

export const UserControllers = {
  createTutor,
  getMe,
  changeStatus,
};
