import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { TutorRoutes } from '../modules/tutor/tutor.route';
import { StudentRoutes } from '../modules/student/student.route';
import { AttendanceRoutes } from '../modules/attendance/attendance.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { RoutineRoutes } from '../modules/routine/routine.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/tutors',
    route: TutorRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/routines',
    route: RoutineRoutes,
  },
  {
    path: '/attendances',
    route: AttendanceRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
