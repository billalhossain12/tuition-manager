import express from 'express';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AttendanceControllers } from './attendance.controller';
import {
  markAttendanceValidationSchema,
  updateAttendanceValidationSchema,
} from './attendance.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.tutor),
  validateRequest(markAttendanceValidationSchema),
  AttendanceControllers.markAttendance,
);

router.get('/', auth(USER_ROLE.tutor), AttendanceControllers.getAllAttendances);
router.get(
  '/today',
  auth(USER_ROLE.tutor),
  AttendanceControllers.getTodayAttendances,
);

router.get(
  '/:attendanceId',
  auth(USER_ROLE.tutor),
  AttendanceControllers.getSingleAttendance,
);

router.patch(
  '/:attendanceId',
  auth(USER_ROLE.tutor),
  validateRequest(updateAttendanceValidationSchema),
  AttendanceControllers.updateAttendance,
);

router.delete(
  '/:attendanceId',
  auth(USER_ROLE.tutor),
  AttendanceControllers.deleteAttendance,
);

export const AttendanceRoutes = router;
