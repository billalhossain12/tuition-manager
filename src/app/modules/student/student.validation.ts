import { z } from 'zod';

export const createStudentValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    subject: z.string(),
    salaryPerMonth: z.number(),
    address: z.string(),
  }),
});

export const updateStudentValidationSchema = z.object({
  body: z.object({
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
