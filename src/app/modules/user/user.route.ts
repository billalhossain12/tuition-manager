/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';
import { createTutorValidationSchema } from '../tutor/tutor.validation';

const router = express.Router();

router.post(
  '/create-tutor',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createTutorValidationSchema),
  UserControllers.createTutor,
);

router.patch(
  '/change-status/:id',
  auth(USER_ROLE.superAdmin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

router.get(
  '/me',
  auth(USER_ROLE.superAdmin, USER_ROLE.tutor),
  UserControllers.getMe,
);

export const UserRoutes = router;
