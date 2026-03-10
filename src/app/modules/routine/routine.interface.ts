import { Types } from 'mongoose';

export type TDayScheduleSchema = {
  day: string;
  startTime: string;
  endTime: string;
};

export type TRoutine = {
  tutorId: Types.ObjectId; // which tutor owns this routine
  studentId: Types.ObjectId; // which student
  weeklySchedule: TDayScheduleSchema[];
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDeleted: boolean;
};
