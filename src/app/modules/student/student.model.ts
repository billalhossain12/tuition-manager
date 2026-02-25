import { model, Schema } from 'mongoose';
import { TStudent } from './student.interface';

const studentSchema = new Schema<TStudent>(
  {
    tutorId: {
      type: Schema.Types.ObjectId,
      ref: 'Tutor',
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    subject: {
      type: String,
      trim: true,
      required: true,
    },
    salaryPerMonth: {
      type: Number,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Student = model<TStudent>('Student', studentSchema);
