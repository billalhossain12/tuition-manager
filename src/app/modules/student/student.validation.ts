import mongoose from 'mongoose';
import { z } from 'zod';

const objectSchema = z
  .string()
  .refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid MongoDB ObjectId format',
  });

export const createStudentValidationSchema = z.object({
  body: z.object({
    tutorId: objectSchema,
    name: z.string(),
    subject: z.string(),
    salaryPerMonth: z.number(),
    address: z.string(),
  }),
});

export const updateStudentValidationSchema = z.object({
  body: z.object({
    tutorId: objectSchema,
    name: z.string().optional(),
    subject: z.string().optional(),
    salaryPerMonth: z.number().optional(),
    address: z.string().optional(),
  }),
});

export const AttendanceValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
