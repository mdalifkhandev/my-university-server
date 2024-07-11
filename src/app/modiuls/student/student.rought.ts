import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewere/validateRequest';
import { StudentValidationSchema } from './student.validation';
import { USER_ROLE } from '../users/user.constant';
import auth from '../../middlewere/auth';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentController.getAllStudents,
);

router.get(
  '/:studentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  StudentController.getSingleStudent,
);

router.patch(
  '/:studentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(StudentValidationSchema.updathStudentValidationSchema),
  StudentController.updathStudent,
);

router.delete(
  '/:studentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentController.deletedSingleStudent,
);

export const StudentRought = router;
