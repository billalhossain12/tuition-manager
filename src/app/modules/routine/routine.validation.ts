import mongoose from 'mongoose';
import { z } from 'zod';

const objectSchema = z
  .string()
  .refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid MongoDB ObjectId format',
  });

const routineSchema = z.object({
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export const createRoutineValidationSchema = z.object({
  body: z.object({
    studentId: objectSchema,
    weeklySchedule: z.array(routineSchema),
    startDate: z.string(),
  }),
});

export const updateRoutineValidationSchema = z.object({
  body: z.object({
    studentId: objectSchema.optional(),
    weeklySchedule: z.array(routineSchema).optional(),
    startDate: z.string().optional(),
  }),
});

export const RoutineValidations = {
  createRoutineValidationSchema,
  updateRoutineValidationSchema,
};
