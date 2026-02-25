/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Student } from './student.model';
import { Tutor } from '../tutor/tutor.model';
import { TStudent } from './student.interface';

const createStudentIntoDB = async (userId: string, payload: TStudent) => {
  // checking if the tutor is exist
  const tutor = await Tutor.findOne({ userId });
  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This tutor does not exist!');
  }
  const res = Student.create({
    ...payload,
    tutorId: tutor._id,
  });
  return res;
};

const getAllStudentsFromDB = async (userId: string) => {
  // checking if the tutor is exist
  const tutor = await Tutor.findOne({ userId });
  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This tutor does not exist!');
  }
  return Student.find({ tutorId: tutor._id });
};

const getSingleStudentFromDB = async (id: string) => {
  return Student.findById(id);
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  return Student.findByIdAndUpdate(id, payload, { new: true });
};

const deleteStudentFromDB = async (id: string) => {
  return Student.findByIdAndDelete(id);
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
