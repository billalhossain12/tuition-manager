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
  StudentControllers.createStudentIntoDB,
);

router.get('/', auth(USER_ROLE.tutor), StudentControllers.getAllStudents);

router.get('/:id', auth(USER_ROLE.tutor), StudentControllers.getSingleStudent);

router.patch(
  '/:id',
  auth(USER_ROLE.tutor),
  validateRequest(updateStudentValidationSchema),
  StudentControllers.updateStudent,
);

router.delete('/:id', auth(USER_ROLE.tutor), StudentControllers.deleteStudent);

export const StudentRoutes = router;
