import mongoose from 'mongoose';
import { z } from 'zod';
import { AttendanceStatus } from './attendance.constant';

const objectSchema = z
  .string()
  .refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid MongoDB ObjectId format',
  });

export const markAttendanceValidationSchema = z.object({
  body: z.object({
    tutorId: objectSchema,
    studentId: objectSchema,
    date: z.string(),
    status: z.enum([...AttendanceStatus] as [string, ...string[]]),
    note: z.string().optional(),
  }),
});

export const updateAttendanceValidationSchema = z.object({
  body: z.object({
    studentId: objectSchema,
    date: z.string().optional(),
    status: z.enum([...AttendanceStatus] as [string, ...string[]]).optional(),
    note: z.string().optional(),
  }),
});

export const AttendanceValidations = {
  markAttendanceValidationSchema,
  updateAttendanceValidationSchema,
};
