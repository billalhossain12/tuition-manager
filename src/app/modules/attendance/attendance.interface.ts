import { Types } from 'mongoose';

export interface TAttendance {
  tutorId: Types.ObjectId;
  studentId: Types.ObjectId;
  date: Date;
  status: 'taught' | 'cancelled' | 'absent';
  note: string;
  isDeleted: boolean;
}
