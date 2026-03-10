import express from 'express';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { RoutineControllers } from './routine.controller';
import {
  createRoutineValidationSchema,
  updateRoutineValidationSchema,
} from './routine.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.tutor),
  validateRequest(createRoutineValidationSchema),
  RoutineControllers.createMyRoutineIntoDB,
);

router.get('/', auth(USER_ROLE.tutor), RoutineControllers.getMyAllRoutines);

router.get(
  '/:routineId',
  auth(USER_ROLE.tutor),
  RoutineControllers.getMySingleRoutine,
);

router.patch(
  '/:routineId',
  auth(USER_ROLE.tutor),
  validateRequest(updateRoutineValidationSchema),
  RoutineControllers.updateMyRoutine,
);

router.delete(
  '/:routineId',
  auth(USER_ROLE.tutor),
  RoutineControllers.deleteMyRoutine,
);

export const RoutineRoutes = router;
