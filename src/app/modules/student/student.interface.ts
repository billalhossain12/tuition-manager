import { Types } from 'mongoose';

export type TStudent = {
  tutorId: Types.ObjectId;
  name: string;
  phone:string;
  subject: string;
  salaryPerMonth: number;
  address: string;
  isDeleted: boolean;
};
