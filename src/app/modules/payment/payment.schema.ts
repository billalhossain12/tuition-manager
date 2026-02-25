import { model, Schema } from 'mongoose';
import { PaymentMethod, PaymentStatus } from './payment.constant';
import { TPayment } from './payment.interface';

const paymentSchema = new Schema<TPayment>(
  {
    tutorId: {
      type: Schema.Types.ObjectId,
      ref: 'Tutor',
      required: true,
      index: true,
    },

    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },

    month: {
      type: Number, // 1–12
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [...PaymentStatus],
      default: 'paid',
    },

    paymentDate: {
      type: Date,
      required: true,
    },

    method: {
      type: String,
      enum: [...PaymentMethod],
      default: 'cash',
    },

    note: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Payment = model<TPayment>('Payment', paymentSchema);
