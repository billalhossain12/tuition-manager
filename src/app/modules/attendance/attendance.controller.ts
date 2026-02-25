import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AttendanceServices } from './attendance.service';

const markAttendance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AttendanceServices.markAttendanceIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance is retrieved succesfully',
    data: result,
  });
});

const getSingleAttendance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AttendanceServices.getSingleAttendanceFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance is retrieved succesfully',
    data: result,
  });
});

const getAllAttendances = catchAsync(async (req, res) => {
  const result = await AttendanceServices.getAllAttendancesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendances are retrieved succesfully',
    data: result,
  });
});

const updateAttendance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { tutor } = req.body;
  const result = await AttendanceServices.updateAttendanceIntoDB(id, tutor);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance is updated succesfully',
    data: result,
  });
});

const deleteAttendance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AttendanceServices.deleteAttendanceFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance is deleted succesfully',
    data: result,
  });
});

export const AttendanceControllers = {
  markAttendance,
  getAllAttendances,
  getSingleAttendance,
  deleteAttendance,
  updateAttendance,
};
