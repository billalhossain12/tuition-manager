import express from 'express';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TutorControllers } from './tutor.controller';
import { updateTutorValidationSchema } from './tutor.validation';

const router = express.Router();

router.get('/', auth(USER_ROLE.superAdmin), TutorControllers.getAllTutors);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.tutor),
  TutorControllers.getSingleTutor,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.tutor),
  validateRequest(updateTutorValidationSchema),
  TutorControllers.updateTutor,
);

router.delete('/:id', auth(USER_ROLE.superAdmin), TutorControllers.deleteTutor);

export const TutorRoutes = router;
