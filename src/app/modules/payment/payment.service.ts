/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Tutor } from '../tutor/tutor.model';
import { Payment } from './payment.schema';
import { TPayment } from './payment.interface';

const createPaymentIntoDB = async (userId: string, payload: TPayment) => {
  const tutor = await Tutor.findOne({ userId });
  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This tutor does not exist.');
  }

  return Payment.create({
    ...payload,
    tutorId: tutor._id,
  });
};

const getStudentPaymentsFromDB = async (studentId: string) => {
  return Payment.find({ studentId }).sort({
    year: -1,
    month: -1,
  });
};

export const PaymentServices = {
  createPaymentIntoDB,
  getStudentPaymentsFromDB,
};
