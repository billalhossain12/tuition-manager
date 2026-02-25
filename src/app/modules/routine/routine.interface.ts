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
  monthlySalary: 5000;
  startDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
};
