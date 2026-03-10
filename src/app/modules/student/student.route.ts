import express from 'express';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import {
  createStudentValidationSchema,
  updateStudentValidationSchema,
} from './student.validation';
import { StudentControllers } from './student.controller';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.tutor),
  validateRequest(createStudentValidationSchema),
  StudentControllers.createMyStudentIntoDB,
);

router.get('/', auth(USER_ROLE.tutor), StudentControllers.getMyAllStudents);

router.get(
  '/:studentId',
  auth(USER_ROLE.tutor),
  StudentControllers.getMySingleStudent,
);

router.patch(
  '/:studentId',
  auth(USER_ROLE.tutor),
  validateRequest(updateStudentValidationSchema),
  StudentControllers.updateMyStudent,
);

router.delete(
  '/:studentId',
  auth(USER_ROLE.tutor),
  StudentControllers.deleteMyStudent,
);

export const StudentRoutes = router;
