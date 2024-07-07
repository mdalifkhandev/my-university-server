import { UserController } from './user.controller';
import validateRequest from '../../middlewere/validateRequest';
import e from 'express';
import { createStudentValidationSchema } from '../student/student.validation';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import auth from '../../middlewere/auth';
import { USER_ROLE } from './user.constant';

const router = e.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  validateRequest(createStudentValidationSchema),
  UserController.createStudent,
);

// router.post(
//   '/create-faculty',
//   auth(USER_ROLE.admin),
//   validateRequest(createFacultyValidationSchema),
//   UserControllers.createFaculty,
// );

router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  validateRequest(createAdminValidationSchema),
  UserController.createAdmin,
);

export const UserRought = router;
