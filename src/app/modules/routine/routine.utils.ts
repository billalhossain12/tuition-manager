import httpStatus from 'http-status';
import { TDayScheduleSchema, TRoutine } from './routine.interface';
import AppError from '../../errors/AppError';

export const timeToMinutes = (time: string): number => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

// Helper function to convert 24-hour time to 12-hour AM/PM format
export const formatTimeToAMPM = (time: string): string => {
  const [hour, minute] = time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hourIn12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hourIn12}:${minute.toString().padStart(2, '0')} ${period}`;
};

export const isTimeOverlap = (
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

export const checkRoutineConflict = (
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
          const startTimeFormatted = formatTimeToAMPM(schedule.startTime);
          const endTimeFormatted = formatTimeToAMPM(schedule.endTime);
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Routine conflict on ${newSchedule.day} (${startTimeFormatted} - ${endTimeFormatted})`,
          );
        }
      }
    }
  }
};
