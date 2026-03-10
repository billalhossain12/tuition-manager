/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Routine } from './routine.model';
import { Tutor } from '../tutor/tutor.model';
import { TDayScheduleSchema, TRoutine } from './routine.interface';
import { Student } from '../student/student.model';

const timeToMinutes = (time: string): number => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

const isTimeOverlap = (
  startA: string,
  endA: string,
  startB: string,
  endB: string,
) => {
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);

  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);

  return aStart < bEnd && aEnd > bStart;
};

const checkRoutineConflict = (
  newSchedules: TDayScheduleSchema[],
  existingRoutines: TRoutine[],
) => {
  for (const newSchedule of newSchedules) {
    for (const routine of existingRoutines) {
      const matchedDaySchedule = routine.weeklySchedule.filter(
        s => s.day === newSchedule.day,
      );

      for (const schedule of matchedDaySchedule) {
        const conflict = isTimeOverlap(
          newSchedule.startTime,
          newSchedule.endTime,
          schedule.startTime,
          schedule.endTime,
        );

        if (conflict) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Routine conflict on ${newSchedule.day} (${schedule.startTime} - ${schedule.endTime})`,
          );
        }
      }
    }
  }
};

const createMyRoutineIntoDB = async (userId: string, payload: TRoutine) => {
  const tutor = await Tutor.findOne({ user: userId });

  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This tutor does not exist!');
  }

  const student = await Student.findOne({
    _id: payload.studentId,
    tutorId: tutor._id,
  });

  if (!student) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Student not found or unauthorized',
    );
  }

  const existingRoutine = await Routine.findOne({
    studentId: payload.studentId,
    tutorId: tutor._id,
    isActive: true,
  });

  if (existingRoutine) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Routine already exists for this student',
    );
  }

  // 🔎 Only fetch relevant routines
  const tutorRoutines = await Routine.find({
    tutorId: tutor._id,
    isActive: true,
    isDeleted: false,
  }).select('weeklySchedule');

  // ⚠️ conflict check
  checkRoutineConflict(payload.weeklySchedule, tutorRoutines);

  const routine = await Routine.create({
    ...payload,
    tutorId: tutor._id,
  });

  return routine;
};

const getMyAllRoutinesFromDB = async (userId: string) => {
  // checking if the tutor is exist
  const tutor = await Tutor.findOne({ user: userId });
  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This tutor does not exist!');
  }
  const routines = await Routine.find({
    tutorId: tutor._id,
    isActive: true,
  })
    .populate('studentId', 'name phone address subject')
    .sort({ createdAt: -1 });

  return routines;
};

const getMySingleRoutineFromDB = async (routineId: string, userId: string) => {
  // checking if the tutor is exist
  const tutor = await Tutor.findOne({ user: userId });
  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This tutor does not exist!');
  }

  const routine = await Routine.findOne({
    _id: routineId,
    tutorId: tutor._id,
    isActive: true,
  }).populate('studentId');

  if (!routine) {
    throw new Error('Routine not found');
  }

  return routine;
};

const updateMyRoutineIntoDB = async (
  routineId: string,
  userId: string,
  payload: Partial<TRoutine>,
) => {
  // checking if the tutor is exist
  const tutor = await Tutor.findOne({ user: userId });
  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This tutor does not exist!');
  }

  const routine = await Routine.findOneAndUpdate(
    {
      _id: routineId,
      tutorId: tutor._id,
      isActive: true,
    },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!routine) {
    throw new Error('Routine not found or unauthorized');
  }

  return routine;
};

const deleteMyRoutineFromDB = async (routineId: string, userId: string) => {
  // checking if the tutor is exist
  const tutor = await Tutor.findOne({ user: userId });
  if (!tutor) {
    throw new AppError(httpStatus.NOT_FOUND, 'This tutor does not exist!');
  }

  const routine = await Routine.findOneAndUpdate(
    {
      _id: routineId,
      tutorId: tutor._id,
      isActive: true,
    },
    {
      isActive: false,
    },
    {
      new: true,
    },
  );

  if (!routine) {
    throw new Error('Routine not found or unauthorized');
  }

  return routine;
};

export const RoutineServices = {
  createMyRoutineIntoDB,
  getMyAllRoutinesFromDB,
  getMySingleRoutineFromDB,
  updateMyRoutineIntoDB,
  deleteMyRoutineFromDB,
};
