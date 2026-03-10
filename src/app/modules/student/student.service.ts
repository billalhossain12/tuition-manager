/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Student } from './student.model';
import { Tutor } from '../tutor/tutor.model';
import { TStudent } from './student.interface';

const createMyStudentIntoDB = async (userId: string, payload: TStudent) => {
  // checking if the tutor is exist
  const tutor = await Tutor.findOne({ user: userId });
  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This tutor does not exist!');
  }
  const res = Student.create({
    ...payload,
    tutorId: tutor._id,
  });
  return res;
};

const getMyAllStudentsFromDB = async (userId: string) => {
  // checking if the tutor is exist
  const tutor = await Tutor.findOne({ user: userId });
  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This tutor does not exist!');
  }
  return Student.find({ tutorId: tutor._id });
};

const getMySingleStudentFromDB = async (studentId: string, userId: string) => {
  // checking if the tutor is exist
  const tutor = await Tutor.findOne({ user: userId });
  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This tutor does not exist!');
  }

  //check if this is a valid tutor
  const student = await Student.findOne({ _id: studentId, tutorId: tutor._id });
  if (!student) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'This student does not exist!');
  }

  return Student.findOne({ _id: studentId, tutorId: tutor._id });
};

const updateMyStudentIntoDB = async (
  studentId: string,
  userId: string,
  payload: Partial<TStudent>,
) => {
  // checking if the tutor is exist
  const tutor = await Tutor.findOne({ user: userId });
  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This student does not exist!');
  }

  //check if this is a valid tutor
  const student = await Student.findOne({ _id: studentId, tutorId: tutor._id });
  if (!student) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'This student does not exist!');
  }

  return Student.findOneAndUpdate(
    { _id: studentId, tutorId: tutor._id },
    payload,
    {
      new: true,
    },
  );
};

const deleteMyStudentFromDB = async (studentId: string, userId: string) => {
  // checking if the tutor is exist
  const tutor = await Tutor.findOne({ user: userId });
  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This tutor does not exist!');
  }

  //check if this is a valid tutor
  const student = await Student.findOne({ _id: studentId, tutorId: tutor._id });
  if (!student) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'This student does not exist!');
  }

  return Student.findOneAndDelete({ _id: studentId, tutorId: tutor._id });
};

export const StudentServices = {
  createMyStudentIntoDB,
  getMyAllStudentsFromDB,
  getMySingleStudentFromDB,
  updateMyStudentIntoDB,
  deleteMyStudentFromDB,
};
