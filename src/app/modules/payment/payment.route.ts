import express from 'express';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentControllers } from './payment.controller';
import { createPaymentValidationSchema } from './payment.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.tutor),
  validateRequest(createPaymentValidationSchema),
  PaymentControllers.createPayment,
);

router.get(
  '/:studentId',
  auth(USER_ROLE.tutor),
  PaymentControllers.getPayments,
);

export const PaymentRoutes = router;
