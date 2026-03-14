import { Types } from 'mongoose';

export interface TAttendance {
  tutorId: Types.ObjectId;
  studentId: Types.ObjectId;
  routineId:Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'pending';
  note: string;
  isDeleted: boolean;
}
