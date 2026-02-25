/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from 'mongoose';
import { TUser } from './user.interface';
import { User } from './user.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Tutor } from '../tutor/tutor.model';
import { TTutor } from '../tutor/tutor.interface';

const createTutorIntoDB = async (file: any, payload: TTutor) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = payload.password;

  //set user role
  userData.role = 'tutor';

  //set tutor email
  userData.email = payload.email;
  //set tutor name
  userData.name = payload.fullName;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (file) {
      const imageName = `${payload?.fullName}`;
      const path = file?.path;
      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // checking if the user is already exist
    const user = await User.findOne({ email: payload.email });

    if (user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is already exist!');
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a tutor
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create tutor');
    }
    // set _id as user
    payload.user = newUser[0]._id; //reference _id

    // create a tutor (transaction-2)
    const newTutor = await Tutor.create([payload], { session });

    if (!newTutor.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create tutor');
    }

    await session.commitTransaction();
    await session.endSession();

    return newTutor;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMe = async (userId: Types.ObjectId, role: string) => {
  let result = null;
  if (role === 'tutor') {
    result = await Tutor.findOne({ user: userId });
  }
  if (role === 'superAdmin') {
    result = await User.findById(userId);
  }
  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  createTutorIntoDB,
  getMe,
  changeStatus,
};
