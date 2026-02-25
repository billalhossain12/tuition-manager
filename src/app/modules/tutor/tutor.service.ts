/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import { Tutor } from './tutor.model';
import { TTutor } from './tutor.interface';

const getAllTutorsFromDB = async () => {
  const result = await Tutor.find({ isDeleted: false });
  return result;
};

const getSingleTutorFromDB = async (id: string) => {
  const result = await Tutor.findById(id);
  return result;
};

const updateTutorIntoDB = async (id: string, payload: Partial<TTutor>) => {
  // checking if the tutor is exist
  const tutor = await Tutor.findById(id);

  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This tutor does not exist!');
  }

  const result = await Tutor.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteTutorFromDB = async (tutorId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deleteTutor = await Tutor.findByIdAndUpdate(
      tutorId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteTutor) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete tutor');
    }

    // get user _id from deletedTutor
    const userId = deleteTutor.user;

    const deletedUser = await User.findOneAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deleteTutor;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const TutorServices = {
  getAllTutorsFromDB,
  getSingleTutorFromDB,
  updateTutorIntoDB,
  deleteTutorFromDB,
};
