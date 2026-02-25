import { z } from 'zod';

export const createTutorValidationSchema = z.object({
  body: z.object({
    tutor: z.object({
      fullName: z.string(),
      email: z.string(),
      password: z.string(),
      phone: z.string(),
      profileImg: z.string().optional(),
      address: z.string(),
      bio: z.string(),
      subjects: z.array(z.string()),
    }),
  }),
});

export const updateTutorValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    profileImg: z.string().optional(),
  }),
});

export const TutorValidations = {
  createTutorValidationSchema,
  updateTutorValidationSchema,
};
