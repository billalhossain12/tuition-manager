import mongoose from 'mongoose';
import { z } from 'zod';
import { PaymentMethod, PaymentStatus } from './payment.constant';

const objectSchema = z
  .string()
  .refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid MongoDB ObjectId format',
  });

export const createPaymentValidationSchema = z.object({
  body: z.object({
    studentId: objectSchema,
    amount: z.number(),
    month: z.number(),
    year: z.number(),
    status: z.enum([...PaymentStatus] as [string, ...string[]]),
    method: z.enum([...PaymentMethod] as [string, ...string[]]),
    paymentDate: z.string(),
    note: z.string(),
  }),
});

export const updatePaymentValidationSchema = z.object({
  body: z.object({
    studentId: objectSchema,
    amount: z.number().optional(),
    month: z.number().optional(),
    year: z.number().optional(),
    status: z.enum([...PaymentStatus] as [string, ...string[]]).optional(),
    method: z.enum([...PaymentMethod] as [string, ...string[]]).optional(),
    paymentDate: z.string().optional(),
    note: z.string().optional(),
  }),
});

export const AttendanceValidations = {
  createPaymentValidationSchema,
  updatePaymentValidationSchema,
};
