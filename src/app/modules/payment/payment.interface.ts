import { Types } from 'mongoose';

export type TPayment = {
  tutorId: Types.ObjectId;
  studentId: Types.ObjectId;
  amount: number;
  month: number;
  year: number;
  status: string;
  paymentDate: Date;
  method: string;
  note: string;
};
