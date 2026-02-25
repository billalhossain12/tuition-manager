/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Attendance } from './attendance.model';
import { Tutor } from '../tutor/tutor.model';
import { TAttendance } from './attendance.interface';

const markAttendanceIntoDB = async (userId: string, payload: TAttendance) => {
  // checking if the tutor is exist
  const tutor = await Tutor.findOne({ userId });
  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This tutor does not exist!');
  }
  const res = Attendance.create({
    ...payload,
    tutorId: tutor._id,
  });
  return res;
};

const getAllAttendancesFromDB = async () => {
  const result = await Attendance.find({ status: 'taught' });
  return result;
};

const getSingleAttendanceFromDB = async (studentId: string) => {
  const result = Attendance.find({ studentId });
  return result;
};

const updateAttendanceIntoDB = async (
  id: string,
  payload: Partial<TAttendance>,
) => {
  // checking if the attendance is exist
  const attendance = await Attendance.findById(id);

  if (!attendance) {
    throw new AppError(httpStatus.NOT_FOUND, 'This attendance does not exist!');
  }

  const result = await Attendance.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteAttendanceFromDB = async (id: string) => {
  const res = await Attendance.findByIdAndUpdate(id, { isDeleted: true });
  return res;
};

export const AttendanceServices = {
  markAttendanceIntoDB,
  getAllAttendancesFromDB,
  getSingleAttendanceFromDB,
  updateAttendanceIntoDB,
  deleteAttendanceFromDB,
};
