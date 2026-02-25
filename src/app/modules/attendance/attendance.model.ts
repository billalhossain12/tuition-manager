import { model, Schema } from 'mongoose';
import { TAttendance } from './attendance.interface';
import { AttendanceStatus } from './attendance.constant';

const attendanceSchema = new Schema<TAttendance>(
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

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: {
        values: [...AttendanceStatus],
        message: `{VALUE} is not a valid attendance status`,
      },
      default: 'taught',
    },
    note: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Attendance = model<TAttendance>('Attendance', attendanceSchema);
