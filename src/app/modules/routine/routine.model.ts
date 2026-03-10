import { model, Schema } from 'mongoose';
import { TDayScheduleSchema, TRoutine } from './routine.interface';

const dayScheduleSchema = new Schema<TDayScheduleSchema>(
  {
    day: {
      type: String,
      required: true,
      enum: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
    },
    startTime: {
      type: String,
      required: true, // "HH:mm"
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { _id: false, versionKey: false },
);

const routineSchema = new Schema<TRoutine>(
  {
    tutorId: {
      type: Schema.Types.ObjectId,
      ref: 'Tutor',
      required: true,
    },

    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },

    weeklySchedule: {
      type: [dayScheduleSchema],
      required: true,
      validate: {
        validator: function (value: string) {
          return value.length > 0;
        },
        message: 'At least one schedule day is required',
      },
    },

    startDate: {
      type: Date,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Routine = model<TRoutine>('Routine', routineSchema);
