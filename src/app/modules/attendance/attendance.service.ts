/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Attendance } from './attendance.model';
import { Tutor } from '../tutor/tutor.model';
import { TAttendance } from './attendance.interface';

const markAttendanceIntoDB = async (userId: string, payload: TAttendance) => {
  // checking if the tutor is exist
  const tutor = await Tutor.findOne({ user: userId });
  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This tutor does not exist!');
  }

  // Check if attendence exist
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  const existing = await Attendance.findOne({
    routineId: payload.routineId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  //If attendence exist, update
  if (existing) {
    return Attendance.findByIdAndUpdate(
      existing._id,
      { status: payload.status, note: payload.note },
      { new: true },
    );
  }

  //Create a new attendence
  return Attendance.create({
    ...payload,
    date: today,
    tutorId: tutor._id,
  });
};

const getAllAttendancesFromDB = async () => {
  const result = await Attendance.find()
    .populate('studentId')
    .populate('routineId');
  return result;
};

const getTodayAttendancesFromDB = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  return await Attendance.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });
};

const getSingleAttendanceFromDB = async (attendanceId: string) => {
  const result = Attendance.find({ attendanceId });
  return result;
};

const updateAttendanceIntoDB = async (
  attendanceId: string,
  payload: Partial<TAttendance>,
) => {
  // checking if the attendance is exist
  const attendance = await Attendance.findById(attendanceId);

  if (!attendance) {
    throw new AppError(httpStatus.NOT_FOUND, 'This attendance does not exist!');
  }

  const result = await Attendance.findByIdAndUpdate(attendance, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteAttendanceFromDB = async (attendanceId: string) => {
  const res = await Attendance.findByIdAndUpdate(attendanceId, {
    isDeleted: true,
  });
  return res;
};

export const AttendanceServices = {
  markAttendanceIntoDB,
  getAllAttendancesFromDB,
  getTodayAttendancesFromDB,
  getSingleAttendanceFromDB,
  updateAttendanceIntoDB,
  deleteAttendanceFromDB,
};
